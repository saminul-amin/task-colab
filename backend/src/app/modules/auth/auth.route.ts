import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { auth } from "../../middlewares/auth";
import { uploadImage } from "../../middlewares/upload";

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
  "/google",
  validateRequest(AuthValidation.googleAuthValidation),
  AuthController.googleAuth
);

router.post(
  "/change-password",
  auth(),
  validateRequest(AuthValidation.changePasswordValidation),
  AuthController.changePassword
);

router.get("/me", auth(), AuthController.getMe);

router.patch(
  "/me",
  auth(),
  uploadImage.single("profileImage"),
  AuthController.updateProfile
);

export const AuthRoutes = router;
