import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { USER_ROLES } from "./user.constant";

const router = Router();

router.get("/me", auth(), UserController.getMyProfile);

router.patch(
  "/me",
  auth(),
  validateRequest(UserValidation.updateUserValidation),
  UserController.updateMyProfile
);

router.get("/", auth(USER_ROLES.ADMIN), UserController.getAllUsers);

router.get("/:id", auth(USER_ROLES.ADMIN), UserController.getUserById);

router.patch(
  "/:id/role",
  auth(USER_ROLES.ADMIN),
  validateRequest(UserValidation.updateUserRoleValidation),
  UserController.updateUserRole
);

router.patch(
  "/:id/status",
  auth(USER_ROLES.ADMIN),
  validateRequest(UserValidation.updateUserStatusValidation),
  UserController.updateUserStatus
);

router.delete("/:id", auth(USER_ROLES.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
