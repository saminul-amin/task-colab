import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { ITask, ITaskFilters, ITaskPagination } from "./task.interface";
import { Task } from "./task.model";
import { TASK_STATUS } from "./task.constant";
import { Project } from "../project/project.model";
import { PROJECT_STATUS } from "../project/project.constant";
import { USER_ROLES } from "../user/user.constant";

const createTask = async (
  userId: string,
  payload: { projectId: string } & Partial<ITask>
) => {
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (!project.assignedTo || project.assignedTo.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not assigned to this project");
  }

  if (
    project.status !== PROJECT_STATUS.ASSIGNED &&
    project.status !== PROJECT_STATUS.IN_PROGRESS
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot add tasks to project in current state");
  }

  const lastTask = await Task.findOne({ project: payload.projectId })
    .sort({ order: -1 })
    .select("order");
  const nextOrder = lastTask ? lastTask.order + 1 : 1;

  const taskData = {
    project: payload.projectId,
    createdBy: userId,
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    timeline: payload.timeline,
    estimatedHours: payload.estimatedHours,
    status: TASK_STATUS.TODO,
    order: nextOrder,
  };

  const task = await Task.create(taskData);

  if (project.status === PROJECT_STATUS.ASSIGNED) {
    await Project.findByIdAndUpdate(payload.projectId, {
      $set: { status: PROJECT_STATUS.IN_PROGRESS, "timeline.startDate": new Date() },
    });
  }

  return task.populate([
    { path: "project", select: "title" },
    { path: "createdBy", select: "name email" },
  ]);
};

const getTasksForProject = async (
  projectId: string,
  userId: string,
  userRole: string,
  filters: ITaskFilters,
  pagination: ITaskPagination
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isBuyer = project.buyer.toString() === userId;
  const isAssigned = project.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isBuyer && !isAssigned && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view tasks for this project");
  }

  const { status, priority } = filters;
  const { page = 1, limit = 50, sortBy = "order", sortOrder = "asc" } = pagination;

  const conditions: Record<string, unknown> = { project: projectId };
  if (status) conditions.status = status;
  if (priority) conditions.priority = priority;

  const skip = (page - 1) * limit;
  const sortCondition: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [tasks, total] = await Promise.all([
    Task.find(conditions)
      .populate("createdBy", "name email profileImage")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(conditions),
  ]);

  return {
    data: tasks,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getTaskById = async (taskId: string, userId: string, userRole: string) => {
  const task = await Task.findById(taskId)
    .populate("project", "title buyer assignedTo status")
    .populate("createdBy", "name email profileImage");

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const projectDoc = task.project as unknown as {
    buyer: { toString: () => string };
    assignedTo?: { toString: () => string };
  };

  const isBuyer = projectDoc.buyer.toString() === userId;
  const isAssigned = projectDoc.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isBuyer && !isAssigned && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view this task");
  }

  return task;
};

const updateTask = async (
  taskId: string,
  userId: string,
  payload: Partial<ITask>
) => {
  const task = await Task.findById(taskId).populate("project");

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const project = task.project as unknown as {
    assignedTo?: { toString: () => string };
    status: string;
  };

  if (project.assignedTo?.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the assigned problem solver can update tasks");
  }

  if (task.status === TASK_STATUS.COMPLETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot update completed tasks");
  }

  const { project: proj, createdBy, status, order, ...updateData } = payload as Record<string, unknown>;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("project", "title")
    .populate("createdBy", "name email");

  return updatedTask;
};

const updateTaskStatus = async (
  taskId: string,
  userId: string,
  userRole: string,
  newStatus: string
) => {
  const task = await Task.findById(taskId).populate("project");

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const project = task.project as unknown as {
    _id: { toString: () => string };
    buyer: { toString: () => string };
    assignedTo?: { toString: () => string };
  };

  const isBuyer = project.buyer.toString() === userId;
  const isAssigned = project.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  const allowedTransitions: Record<string, { to: string[]; by: string[] }> = {
    [TASK_STATUS.TODO]: {
      to: [TASK_STATUS.IN_PROGRESS],
      by: ["problem_solver"],
    },
    [TASK_STATUS.IN_PROGRESS]: {
      to: [TASK_STATUS.REVIEW, TASK_STATUS.TODO],
      by: ["problem_solver"],
    },
    [TASK_STATUS.REVIEW]: {
      to: [TASK_STATUS.COMPLETED, TASK_STATUS.IN_PROGRESS],
      by: ["buyer", "admin"],
    },
    [TASK_STATUS.COMPLETED]: {
      to: [],
      by: [],
    },
  };

  const currentTransition = allowedTransitions[task.status];

  if (!currentTransition.to.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot transition from ${task.status} to ${newStatus}`
    );
  }

  const canTransition =
    isAdmin ||
    (isBuyer && currentTransition.by.includes("buyer")) ||
    (isAssigned && currentTransition.by.includes("problem_solver"));

  if (!canTransition) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to change this task status"
    );
  }

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === TASK_STATUS.IN_PROGRESS && !task.timeline.startDate) {
    updateData["timeline.startDate"] = new Date();
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: updateData },
    { new: true }
  )
    .populate("project", "title")
    .populate("createdBy", "name email");

  if (newStatus === TASK_STATUS.COMPLETED) {
    const incompleteTasks = await Task.countDocuments({
      project: project._id,
      status: { $ne: TASK_STATUS.COMPLETED },
    });

    if (incompleteTasks === 0) {
      await Project.findByIdAndUpdate(project._id, {
        $set: { status: PROJECT_STATUS.COMPLETED },
      });
    }
  }

  return updatedTask;
};

const reorderTasks = async (projectId: string, userId: string, taskIds: string[]) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (project.assignedTo?.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the assigned problem solver can reorder tasks");
  }

  const bulkOps = taskIds.map((taskId, index) => ({
    updateOne: {
      filter: { _id: taskId, project: projectId },
      update: { $set: { order: index + 1 } },
    },
  }));

  await Task.bulkWrite(bulkOps);

  return Task.find({ project: projectId })
    .sort({ order: 1 })
    .populate("createdBy", "name email");
};

const deleteTask = async (taskId: string, userId: string, userRole: string) => {
  const task = await Task.findById(taskId).populate("project");

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const project = task.project as unknown as {
    assignedTo?: { toString: () => string };
  };

  const isAssigned = project.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isAssigned && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to delete this task");
  }

  if (task.status === TASK_STATUS.COMPLETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete completed tasks");
  }

  await Task.findByIdAndUpdate(taskId, { $set: { isDeleted: true } });

  return null;
};

export const TaskService = {
  createTask,
  getTasksForProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  deleteTask,
};
