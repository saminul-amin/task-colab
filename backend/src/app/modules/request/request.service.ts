import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { IRequest, IRequestFilters, IRequestPagination } from "./request.interface";
import { Request } from "./request.model";
import { REQUEST_STATUS } from "./request.constant";
import { Project } from "../project/project.model";
import { PROJECT_STATUS } from "../project/project.constant";
import { User } from "../user/user.model";
import { USER_ROLES } from "../user/user.constant";

const createRequest = async (problemSolverId: string, payload: { projectId: string } & Partial<IRequest>) => {
  const user = await User.findById(problemSolverId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role !== USER_ROLES.PROBLEM_SOLVER) {
    throw new AppError(httpStatus.FORBIDDEN, "Only problem solvers can request to work on projects");
  }

  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (project.status !== PROJECT_STATUS.OPEN) {
    throw new AppError(httpStatus.BAD_REQUEST, "Project is not open for requests");
  }

  const existingRequest = await Request.hasUserRequested(payload.projectId, problemSolverId);
  if (existingRequest) {
    throw new AppError(httpStatus.CONFLICT, "You have already requested to work on this project");
  }

  const requestData = {
    project: payload.projectId,
    problemSolver: problemSolverId,
    coverLetter: payload.coverLetter,
    proposedBudget: payload.proposedBudget,
    proposedTimeline: payload.proposedTimeline,
    status: REQUEST_STATUS.PENDING,
  };

  const request = await Request.create(requestData);

  await Project.findByIdAndUpdate(payload.projectId, { $inc: { applicantsCount: 1 } });

  return request.populate([
    { path: "project", select: "title category budget" },
    { path: "problemSolver", select: "name email profileImage skills" },
  ]);
};

const getRequestsForProject = async (
  projectId: string,
  userId: string,
  userRole: string,
  filters: IRequestFilters,
  pagination: IRequestPagination
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isOwner = project.buyer.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view these requests");
  }

  const { status } = filters;
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = pagination;

  const conditions: Record<string, unknown> = { project: projectId };
  if (status) conditions.status = status;

  const skip = (page - 1) * limit;
  const sortCondition: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [requests, total] = await Promise.all([
    Request.find(conditions)
      .populate("problemSolver", "name email profileImage skills bio")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean(),
    Request.countDocuments(conditions),
  ]);

  return {
    data: requests,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getMyRequests = async (
  userId: string,
  filters: IRequestFilters,
  pagination: IRequestPagination
) => {
  const { status } = filters;
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = pagination;

  const conditions: Record<string, unknown> = { problemSolver: userId };
  if (status) conditions.status = status;

  const skip = (page - 1) * limit;
  const sortCondition: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [requests, total] = await Promise.all([
    Request.find(conditions)
      .populate("project", "title description category budget status timeline")
      .populate("problemSolver", "name email")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean(),
    Request.countDocuments(conditions),
  ]);

  return {
    data: requests,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getRequestById = async (requestId: string, userId: string, userRole: string) => {
  const request = await Request.findById(requestId)
    .populate("project", "title description category budget status buyer")
    .populate("problemSolver", "name email profileImage skills bio");

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  const projectDoc = request.project as unknown as { buyer: { toString: () => string } };
  const isProjectOwner = projectDoc.buyer.toString() === userId;
  const isRequestOwner = request.problemSolver._id.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isProjectOwner && !isRequestOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view this request");
  }

  return request;
};

const updateRequest = async (
  requestId: string,
  userId: string,
  payload: Partial<IRequest>
) => {
  const request = await Request.findById(requestId);

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.problemSolver.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only update your own requests");
  }

  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Can only update pending requests");
  }

  const { project, problemSolver, status, ...updateData } = payload as Record<string, unknown>;

  const updatedRequest = await Request.findByIdAndUpdate(
    requestId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("project", "title category budget")
    .populate("problemSolver", "name email profileImage skills");

  return updatedRequest;
};

const acceptRequest = async (requestId: string, buyerId: string) => {
  const request = await Request.findById(requestId).populate("project");

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  const project = request.project as unknown as {
    _id: { toString: () => string };
    buyer: { toString: () => string };
    status: string;
  };

  if (project.buyer.toString() !== buyerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Only project owner can accept requests");
  }

  if (project.status !== PROJECT_STATUS.OPEN) {
    throw new AppError(httpStatus.BAD_REQUEST, "Project is no longer accepting requests");
  }

  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request is not pending");
  }

  request.status = REQUEST_STATUS.ACCEPTED;
  await request.save();

  await Project.findByIdAndUpdate(project._id, {
    $set: {
      assignedTo: request.problemSolver,
      status: PROJECT_STATUS.ASSIGNED,
    },
  });

  await Request.updateMany(
    {
      project: project._id,
      _id: { $ne: requestId },
      status: REQUEST_STATUS.PENDING,
    },
    {
      $set: {
        status: REQUEST_STATUS.REJECTED,
        rejectionReason: "Another problem solver was selected for this project",
      },
    }
  );

  return Request.findById(requestId)
    .populate("project", "title category budget status assignedTo")
    .populate("problemSolver", "name email profileImage skills");
};

const rejectRequest = async (requestId: string, buyerId: string, rejectionReason?: string) => {
  const request = await Request.findById(requestId).populate("project");

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  const project = request.project as unknown as {
    buyer: { toString: () => string };
  };

  if (project.buyer.toString() !== buyerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Only project owner can reject requests");
  }

  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request is not pending");
  }

  request.status = REQUEST_STATUS.REJECTED;
  if (rejectionReason) {
    request.rejectionReason = rejectionReason;
  }
  await request.save();

  return Request.findById(requestId)
    .populate("project", "title category budget")
    .populate("problemSolver", "name email profileImage skills");
};

const withdrawRequest = async (requestId: string, userId: string) => {
  const request = await Request.findById(requestId);

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.problemSolver.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only withdraw your own requests");
  }

  if (request.status !== REQUEST_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Can only withdraw pending requests");
  }

  request.status = REQUEST_STATUS.WITHDRAWN;
  await request.save();

  await Project.findByIdAndUpdate(request.project, { $inc: { applicantsCount: -1 } });

  return request;
};

const deleteRequest = async (requestId: string, userId: string, userRole: string) => {
  const request = await Request.findById(requestId);

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  const isOwner = request.problemSolver.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to delete this request");
  }

  await Request.findByIdAndUpdate(requestId, { $set: { isDeleted: true } });

  return null;
};

export const RequestService = {
  createRequest,
  getRequestsForProject,
  getMyRequests,
  getRequestById,
  updateRequest,
  acceptRequest,
  rejectRequest,
  withdrawRequest,
  deleteRequest,
};
