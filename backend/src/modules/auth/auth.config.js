export const AUTH_CONFIG = {
  refreshCookieName: "refresh_token",

  refreshTokenDays: 7,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/api/v1/auth",
  },
};