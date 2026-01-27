import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";
import { USER_ROLES } from "../user/user.constant";

const router = Router();

router.get(
  "/open",
  validateRequest(ProjectValidation.getProjectsValidationSchema),
  ProjectController.getOpenProjects
);

router.use(auth());

router.get(
  "/",
  auth(USER_ROLES.ADMIN),
  validateRequest(ProjectValidation.getProjectsValidationSchema),
  ProjectController.getAllProjects
);

router.get(
  "/my-projects",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  validateRequest(ProjectValidation.getProjectsValidationSchema),
  ProjectController.getMyProjects
);

router.post(
  "/",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  validateRequest(ProjectValidation.createProjectValidationSchema),
  ProjectController.createProject
);

router.get("/:id", ProjectController.getProjectById);

router.patch(
  "/:id",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  validateRequest(ProjectValidation.updateProjectValidationSchema),
  ProjectController.updateProject
);

router.patch(
  "/:id/status",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  validateRequest(ProjectValidation.updateProjectStatusValidationSchema),
  ProjectController.updateProjectStatus
);

router.post(
  "/:id/assign",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  validateRequest(ProjectValidation.assignProjectValidationSchema),
  ProjectController.assignProject
);

router.post(
  "/:id/unassign",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  ProjectController.unassignProject
);

router.delete(
  "/:id",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
