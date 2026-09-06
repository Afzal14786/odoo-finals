import { verifyAccessToken } from "../modules/auth/auth.jwt.js";

export const authenticate = (req, res, next) => {
  try {
    const authorization = req.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const token = authorization.slice(7);

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
      code: "INVALID_ACCESS_TOKEN",
    });
  }
};

