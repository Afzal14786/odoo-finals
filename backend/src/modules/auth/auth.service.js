import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

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

const REFRESH_TOKEN_DAYS = 7;

const getRefreshExpiry = () => {
  return new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
};

const getSafeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export class AuthService {
  static async register({ name, email, mobile, address, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = mobile.trim();

    const [existingUser] = await db
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

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        throw createError(
          "Email already registered",
          409,
          "EMAIL_ALREADY_EXISTS",
        );
      }

      throw createError(
        "Mobile number already registered",
        409,
        "MOBILE_ALREADY_EXISTS",
      );
    }

    const passwordHash = await argon2.hash(password);
    const [userCount] = await db.select({ id: users.id }).from(users).limit(1);
    const role = userCount ? USER_ROLES.STAFF : USER_ROLES.ADMIN;

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
      .select()
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

    const validPassword = await argon2.verify(user.passwordHash, password);

    if (!validPassword) {
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

    await db.insert(authSessions).values({
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: getRefreshExpiry(),
      userAgent,
      ipAddress,
    });

    return {
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw createError(
        "Refresh token is required",
        401,
        "REFRESH_TOKEN_REQUIRED",
      );
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const [session] = await db
      .select()
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

    if (session.expiresAt <= new Date()) {
      throw createError(
        "Refresh token has expired",
        401,
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      throw createError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw createError("Your account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    const newRefreshToken = generateRefreshToken();

    await db.transaction(async (tx) => {
      await tx
        .update(authSessions)
        .set({
          revokedAt: new Date(),
        })
        .where(eq(authSessions.id, session.id));

      await tx.insert(authSessions).values({
        userId: user.id,
        tokenHash: hashRefreshToken(newRefreshToken),
        expiresAt: getRefreshExpiry(),
      });
    });

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    return {
      user: getSafeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    await db
      .update(authSessions)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(authSessions.tokenHash, hashRefreshToken(refreshToken)));
  }

  static async getCurrentUser(userId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw createError("User not found", 404, "USER_NOT_FOUND");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw createError("Your account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    return getSafeUser(user);
  }
}
