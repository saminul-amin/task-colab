import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { SubmissionController } from "./submission.controller";
import { SubmissionValidation } from "./submission.validation";
import { USER_ROLES } from "../user/user.constant";
import { upload } from "../../middlewares/upload";

const router = Router();

router.use(auth());

router.post(
  "/",
  auth(USER_ROLES.PROBLEM_SOLVER),
  upload.single("file"),
  validateRequest(SubmissionValidation.createSubmissionValidationSchema),
  SubmissionController.createSubmission
);

router.get(
  "/task/:taskId",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  validateRequest(SubmissionValidation.getSubmissionsValidationSchema),
  SubmissionController.getSubmissionsForTask
);

router.get(
  "/project/:projectId",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  validateRequest(SubmissionValidation.getSubmissionsValidationSchema),
  SubmissionController.getSubmissionsForProject
);

router.get(
  "/:id",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  SubmissionController.getSubmissionById
);

router.post(
  "/:id/review",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  validateRequest(SubmissionValidation.reviewSubmissionValidationSchema),
  SubmissionController.reviewSubmission
);

router.delete(
  "/:id",
  auth(USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  SubmissionController.deleteSubmission
);

export const SubmissionRoutes = router;
