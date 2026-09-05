import { Router } from "express";

import { AuthController } from "./auth.controller.js";

const authRoute = Router();

authRoute.post("/register", AuthController.register);

authRoute.post("/login", AuthController.login);

export default authRoute;
