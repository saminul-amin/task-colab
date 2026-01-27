import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";
import { USER_ROLES } from "../user/user.constant";

const router = Router();

router.use(auth());

router.post(
  "/",
  auth(USER_ROLES.PROBLEM_SOLVER),
  validateRequest(TaskValidation.createTaskValidationSchema),
  TaskController.createTask
);

router.get(
  "/project/:projectId",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  validateRequest(TaskValidation.getTasksValidationSchema),
  TaskController.getTasksForProject
);

router.post(
  "/project/:projectId/reorder",
  auth(USER_ROLES.PROBLEM_SOLVER),
  validateRequest(TaskValidation.reorderTasksValidationSchema),
  TaskController.reorderTasks
);

router.get(
  "/:id",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  TaskController.getTaskById
);

router.patch(
  "/:id",
  auth(USER_ROLES.PROBLEM_SOLVER),
  validateRequest(TaskValidation.updateTaskValidationSchema),
  TaskController.updateTask
);

router.patch(
  "/:id/status",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  validateRequest(TaskValidation.updateTaskStatusValidationSchema),
  TaskController.updateTaskStatus
);

router.delete(
  "/:id",
  auth(USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  TaskController.deleteTask
);

export const TaskRoutes = router;
