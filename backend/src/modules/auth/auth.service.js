import argon2 from "argon2";

import { eq, or } from "drizzle-orm";

import { database as db } from "../../../database/index.js";
import { users } from "../../../database/schema/index.js";

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
        const error = new Error("Email already registered");
        error.statusCode = 409;
        error.code = "EMAIL_ALREADY_EXISTS";

        throw error;
      }

      if (user.mobile === normalizedMobile) {
        const error = new Error("Mobile number already registered");
        error.statusCode = 409;
        error.code = "MOBILE_ALREADY_EXISTS";

        throw error;
      }
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const [user] = await db
      .insert(users)
      .values({
        name,
        email: normalizedEmail,
        mobile: normalizedMobile,
        address,
        passwordHash,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        address: users.address,
        profileUrl: users.profileUrl,
        createdAt: users.createdAt,
      });

    return user;
  }

  static async login({ email, password }) {
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
      })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      const error = new Error("Invalid email or password");

      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";

      throw error;
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");

      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";

      throw error;
    }

    const { passwordHash, ...safeUser } = user;

    return safeUser;
  }
}
