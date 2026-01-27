import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync, sendResponse } from "../../utils";
import { SubmissionService } from "./submission.service";
import { ISubmissionFilters, ISubmissionPagination } from "./submission.interface";
import AppError from "../../utils/AppError";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./submission.constant";

const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { taskId, description } = req.body;

  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "File is required");
  }

  if (!ALLOWED_FILE_TYPES.includes(req.file.mimetype as typeof ALLOWED_FILE_TYPES[number])) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only ZIP files are allowed");
  }

  if (req.file.size > MAX_FILE_SIZE) {
    throw new AppError(httpStatus.BAD_REQUEST, "File size cannot exceed 50MB");
  }

  const fileData = {
    name: req.file.originalname,
    url: req.file.path || `/uploads/${req.file.filename}`,
    size: req.file.size,
    mimeType: req.file.mimetype,
  };

  const result = await SubmissionService.createSubmission(userId, {
    taskId,
    description,
    file: fileData,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Submission created successfully",
    data: result,
  });
});

const getSubmissionsForTask = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { page, limit, sortBy, sortOrder } = req.query;

  const pagination: ISubmissionPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await SubmissionService.getSubmissionsForTask(
    taskId,
    userId,
    userRole,
    pagination
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submissions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSubmissionsForProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { status, page, limit, sortBy, sortOrder } = req.query;

  const filters: ISubmissionFilters = {
    status: status as ISubmissionFilters["status"],
  };

  const pagination: ISubmissionPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await SubmissionService.getSubmissionsForProject(
    projectId,
    userId,
    userRole,
    filters,
    pagination
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submissions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await SubmissionService.getSubmissionById(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission retrieved successfully",
    data: result,
  });
});

const reviewSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const buyerId = req.user!.id;
  const userRole = req.user!.role;

  const result = await SubmissionService.reviewSubmission(id, buyerId, userRole, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission reviewed successfully",
    data: result,
  });
});

const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  await SubmissionService.deleteSubmission(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission deleted successfully",
    data: null,
  });
});

export const SubmissionController = {
  createSubmission,
  getSubmissionsForTask,
  getSubmissionsForProject,
  getSubmissionById,
  reviewSubmission,
  deleteSubmission,
};
