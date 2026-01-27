import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync, sendResponse } from "../../utils";
import { TaskService } from "./task.service";
import { ITaskFilters, ITaskPagination } from "./task.interface";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await TaskService.createTask(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getTasksForProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { status, priority, page, limit, sortBy, sortOrder } = req.query;

  const filters: ITaskFilters = {
    status: status as ITaskFilters["status"],
    priority: priority as ITaskFilters["priority"],
  };

  const pagination: ITaskPagination = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const result = await TaskService.getTasksForProject(
    projectId,
    userId,
    userRole,
    filters,
    pagination
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await TaskService.getTaskById(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const result = await TaskService.updateTask(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const updateTaskStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { status } = req.body;

  const result = await TaskService.updateTaskStatus(id, userId, userRole, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task status updated successfully",
    data: result,
  });
});

const reorderTasks = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user!.id;
  const { taskIds } = req.body;

  const result = await TaskService.reorderTasks(projectId, userId, taskIds);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tasks reordered successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  await TaskService.deleteTask(id, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task deleted successfully",
    data: null,
  });
});

export const TaskController = {
  createTask,
  getTasksForProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  deleteTask,
};
