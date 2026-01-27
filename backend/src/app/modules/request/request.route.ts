import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { RequestController } from "./request.controller";
import { RequestValidation } from "./request.validation";
import { USER_ROLES } from "../user/user.constant";

const router = Router();

router.use(auth());

router.get(
  "/my-requests",
  auth(USER_ROLES.PROBLEM_SOLVER),
  validateRequest(RequestValidation.getRequestsValidationSchema),
  RequestController.getMyRequests
);

router.post(
  "/",
  auth(USER_ROLES.PROBLEM_SOLVER),
  validateRequest(RequestValidation.createRequestValidationSchema),
  RequestController.createRequest
);

router.get(
  "/project/:projectId",
  auth(USER_ROLES.BUYER, USER_ROLES.ADMIN),
  validateRequest(RequestValidation.getRequestsValidationSchema),
  RequestController.getRequestsForProject
);

router.get(
  "/:id",
  auth(USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  RequestController.getRequestById
);

router.patch(
  "/:id",
  auth(USER_ROLES.PROBLEM_SOLVER),
  validateRequest(RequestValidation.updateRequestValidationSchema),
  RequestController.updateRequest
);

router.post(
  "/:id/accept",
  auth(USER_ROLES.BUYER),
  RequestController.acceptRequest
);

router.post(
  "/:id/reject",
  auth(USER_ROLES.BUYER),
  RequestController.rejectRequest
);

router.post(
  "/:id/withdraw",
  auth(USER_ROLES.PROBLEM_SOLVER),
  RequestController.withdrawRequest
);

router.delete(
  "/:id",
  auth(USER_ROLES.PROBLEM_SOLVER, USER_ROLES.ADMIN),
  RequestController.deleteRequest
);

export const RequestRoutes = router;
