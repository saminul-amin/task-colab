import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidation),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidation),
  AuthController.login
);

router.post(
  "/change-password",
  auth(),
  validateRequest(AuthValidation.changePasswordValidation),
  AuthController.changePassword
);

router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;
