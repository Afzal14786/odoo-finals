import argon2 from "argon2";

import { eq, and, or, isNull } from "drizzle-orm";

import { database as db } from "../../../database/index.js";

import {
  users,
  authSessions,
  USER_ROLES,
  USER_STATUS,
} from "../../../database/schema/index.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./auth.jwt.js";

const createError = (message, statusCode, code) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;

  return error;
};

export class AuthService {
  static async register({ name, email, mobile, address, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const normalizedMobile = mobile.trim();

    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        mobile: users.mobile,
      })
      .from(users)
      .where(
        or(
          eq(users.email, normalizedEmail),
          eq(users.mobile, normalizedMobile),
        ),
      )
      .limit(1);

    if (existingUser.length > 0) {
      const user = existingUser[0];

      if (user.email === normalizedEmail) {
        throw createError(
          "Email already registered",
          409,
          "EMAIL_ALREADY_EXISTS",
        );
      }

      if (user.mobile === normalizedMobile) {
        throw createError(
          "Mobile number already registered",
          409,
          "MOBILE_ALREADY_EXISTS",
        );
      }
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    /*
     * The first account becomes ADMIN.
     * Every subsequent public registration
     * becomes STAFF.
     */
    const userCount = await db
      .select({
        id: users.id,
      })
      .from(users)
      .limit(1);

    const role = userCount.length === 0 ? USER_ROLES.ADMIN : USER_ROLES.STAFF;

    const [user] = await db
      .insert(users)
      .values({
        name,
        email: normalizedEmail,
        mobile: normalizedMobile,
        address,
        passwordHash,
        role,
        status: USER_STATUS.ACTIVE,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        address: users.address,
        profileUrl: users.profileUrl,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      });

    return user;
  }

  static async login({ email, password, userAgent, ipAddress }) {
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        address: users.address,
        profileUrl: users.profileUrl,
        passwordHash: users.passwordHash,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      throw createError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw createError("Your account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw createError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(authSessions).values({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    const { passwordHash, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  static async refresh({ refreshToken, userAgent, ipAddress }) {
    if (!refreshToken) {
      throw createError(
        "Refresh token is required",
        401,
        "REFRESH_TOKEN_REQUIRED",
      );
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const [session] = await db
      .select({
        id: authSessions.id,
        userId: authSessions.userId,
        expiresAt: authSessions.expiresAt,
        revokedAt: authSessions.revokedAt,
      })
      .from(authSessions)
      .where(eq(authSessions.tokenHash, tokenHash))
      .limit(1);

    if (!session) {
      throw createError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    if (session.revokedAt) {
      throw createError(
        "Refresh token has been revoked",
        401,
        "REFRESH_TOKEN_REVOKED",
      );
    }

    if (new Date(session.expiresAt) <= new Date()) {
      throw createError(
        "Refresh token has expired",
        401,
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        address: users.address,
        profileUrl: users.profileUrl,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      throw createError("User account not found", 401, "USER_NOT_FOUND");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw createError("Your account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    /*
     * Refresh-token rotation.
     */
    const newRefreshToken = generateRefreshToken();

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.transaction(async (tx) => {
      await tx
        .update(authSessions)
        .set({
          revokedAt: new Date(),
        })
        .where(eq(authSessions.id, session.id));

      await tx.insert(authSessions).values({
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: newExpiresAt,
        userAgent,
        ipAddress,
      });
    });

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    return {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    const tokenHash = hashRefreshToken(refreshToken);

    await db
      .update(authSessions)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(authSessions.tokenHash, tokenHash),
          isNull(authSessions.revokedAt),
        ),
      );
  }

  static async getCurrentUser(userId) {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        address: users.address,
        profileUrl: users.profileUrl,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw createError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw createError("Your account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    return user;
  }
}
