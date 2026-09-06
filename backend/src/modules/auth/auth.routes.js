import { Router } from "express";

import { AuthController } from "./auth.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const authRoute = Router();

authRoute.post("/register", AuthController.register);

authRoute.post("/login", AuthController.login);
authRoute.post("/refresh", AuthController.refresh);
authRoute.post("/logout", AuthController.logout);
authRoute.get("/me", authenticate, AuthController.me);

export default authRoute;
