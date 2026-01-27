import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync, sendResponse } from "../../utils";
import { RequestService } from "./request.service";
import { IRequestFilters, IRequestPagination } from "./request.interface";

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await RequestService.createRequest(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Request submitted successfully",
    data: result,
  });
});

const getRequestsForProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { status, page, limit, sortBy, sortOrder } = req.query;

  const filters: IRequestFilters = {
    status: status as IRequestFilters["status"],
  };

  const pagination: IRequestPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await RequestService.getRequestsForProject(
    projectId,
    userId,
    userRole,
    filters,
    pagination
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Requests retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { status, page, limit, sortBy, sortOrder } = req.query;

  const filters: IRequestFilters = {
    status: status as IRequestFilters["status"],
  };

  const pagination: IRequestPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await RequestService.getMyRequests(userId, filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your requests retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await RequestService.getRequestById(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request retrieved successfully",
    data: result,
  });
});

const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const result = await RequestService.updateRequest(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request updated successfully",
    data: result,
  });
});

const acceptRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const buyerId = req.user!.id;

  const result = await RequestService.acceptRequest(id, buyerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request accepted successfully. Problem solver assigned to project.",
    data: result,
  });
});

const rejectRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const buyerId = req.user!.id;
  const { rejectionReason } = req.body;

  const result = await RequestService.rejectRequest(id, buyerId, rejectionReason);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request rejected successfully",
    data: result,
  });
});

const withdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const result = await RequestService.withdrawRequest(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request withdrawn successfully",
    data: result,
  });
});

const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  await RequestService.deleteRequest(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request deleted successfully",
    data: null,
  });
});

export const RequestController = {
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
