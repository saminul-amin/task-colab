import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync, sendResponse } from "../../utils";
import { ProjectService } from "./project.service";
import { IProjectFilters, IProjectPagination } from "./project.interface";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await ProjectService.createProject(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const {
    searchTerm,
    status,
    category,
    priority,
    minBudget,
    maxBudget,
    buyer,
    assignedTo,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;

  const filters: IProjectFilters = {
    searchTerm: searchTerm as string,
    status: status as IProjectFilters["status"],
    category: category as IProjectFilters["category"],
    priority: priority as IProjectFilters["priority"],
    minBudget: minBudget ? Number(minBudget) : undefined,
    maxBudget: maxBudget ? Number(maxBudget) : undefined,
    buyer: buyer as string,
    assignedTo: assignedTo as string,
  };

  const pagination: IProjectPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await ProjectService.getAllProjects(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectService.getProjectById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const getMyProjects = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const {
    searchTerm,
    status,
    category,
    priority,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;

  const filters: IProjectFilters = {
    searchTerm: searchTerm as string,
    status: status as IProjectFilters["status"],
    category: category as IProjectFilters["category"],
    priority: priority as IProjectFilters["priority"],
  };

  const pagination: IProjectPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await ProjectService.getMyProjects(userId, userRole, filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your projects retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getOpenProjects = catchAsync(async (req: Request, res: Response) => {
  const {
    searchTerm,
    category,
    priority,
    minBudget,
    maxBudget,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;

  const filters: IProjectFilters = {
    searchTerm: searchTerm as string,
    category: category as IProjectFilters["category"],
    priority: priority as IProjectFilters["priority"],
    minBudget: minBudget ? Number(minBudget) : undefined,
    maxBudget: maxBudget ? Number(maxBudget) : undefined,
  };

  const pagination: IProjectPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await ProjectService.getOpenProjects(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Open projects retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const result = await ProjectService.updateProject(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const updateProjectStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { status } = req.body;

  const result = await ProjectService.updateProjectStatus(id, userId, userRole, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project status updated successfully",
    data: result,
  });
});

const assignProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const buyerId = req.user!.id;
  const { problemSolverId } = req.body;

  const result = await ProjectService.assignProject(id, buyerId, problemSolverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project assigned successfully",
    data: result,
  });
});

const unassignProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await ProjectService.unassignProject(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project unassigned successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  await ProjectService.deleteProject(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: null,
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  getOpenProjects,
  updateProject,
  updateProjectStatus,
  assignProject,
  unassignProject,
  deleteProject,
};
