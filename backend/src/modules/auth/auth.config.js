export const AUTH_CONFIG = {
  refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME || "refresh_token",

  refreshTokenDays: 7,

  cookie: {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",

    path: "/api/v1/auth",
  },
};
