import { registerSchema, loginSchema } from "./auth.validation.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  static async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await AuthService.register(validatedData);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await AuthService.login(validatedData);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
