import { registerSchema, loginSchema } from "./auth.validation.js";
import { AuthService } from "./auth.service.js";
import { AUTH_CONFIG } from "./auth.config.js";

const setRefreshCookie = (res, token) => {
  res.cookie(AUTH_CONFIG.refreshCookieName, token, {
    ...AUTH_CONFIG.cookie,
    maxAge: AUTH_CONFIG.refreshTokenDays * 24 * 60 * 60 * 1000,
  });
};

export class AuthController {
  static async register(req, res, next) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await AuthService.register(data);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const data = loginSchema.parse(req.body);

      const result = await AuthService.login({
        ...data,
        userAgent: req.get("user-agent"),
        ipAddress: req.ip,
      });

      setRefreshCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.[AUTH_CONFIG.refreshCookieName];

      const result = await AuthService.refresh(refreshToken);

      setRefreshCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.[AUTH_CONFIG.refreshCookieName];

      await AuthService.logout(refreshToken);

      res.clearCookie(AUTH_CONFIG.refreshCookieName, AUTH_CONFIG.cookie);

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);

      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
