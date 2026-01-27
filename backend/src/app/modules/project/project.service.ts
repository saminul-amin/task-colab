import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { IProject, IProjectFilters, IProjectPagination } from "./project.interface";
import { Project } from "./project.model";
import { PROJECT_STATUS } from "./project.constant";
import { User } from "../user/user.model";
import { USER_ROLES } from "../user/user.constant";

const createProject = async (buyerId: string, payload: Partial<IProject>) => {
  const buyer = await User.findById(buyerId);
  if (!buyer) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (buyer.role !== USER_ROLES.BUYER && buyer.role !== USER_ROLES.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Only buyers can create projects");
  }

  const projectData = {
    ...payload,
    buyer: buyerId,
    status: PROJECT_STATUS.OPEN,
  };

  const project = await Project.create(projectData);
  return project;
};

const getAllProjects = async (
  filters: IProjectFilters,
  pagination: IProjectPagination
) => {
  const {
    searchTerm,
    status,
    category,
    priority,
    minBudget,
    maxBudget,
    buyer,
    assignedTo,
  } = filters;

  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination;

  const conditions: Record<string, unknown>[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
      ],
    });
  }

  if (status) conditions.push({ status });
  if (category) conditions.push({ category });
  if (priority) conditions.push({ priority });
  if (buyer) conditions.push({ buyer });
  if (assignedTo) conditions.push({ assignedTo });

  if (minBudget !== undefined || maxBudget !== undefined) {
    const budgetCondition: Record<string, unknown> = {};
    if (minBudget !== undefined) budgetCondition.$gte = minBudget;
    if (maxBudget !== undefined) budgetCondition.$lte = maxBudget;
    conditions.push({ "budget.max": budgetCondition });
  }

  const whereConditions = conditions.length > 0 ? { $and: conditions } : {};

  const skip = (page - 1) * limit;
  const sortCondition: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [projects, total] = await Promise.all([
    Project.find(whereConditions)
      .populate("buyer", "name email profileImage")
      .populate("assignedTo", "name email profileImage skills")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(whereConditions),
  ]);

  return {
    data: projects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProjectById = async (projectId: string) => {
  const project = await Project.findById(projectId)
    .populate("buyer", "name email profileImage bio")
    .populate("assignedTo", "name email profileImage skills bio");

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  return project;
};

const getMyProjects = async (
  userId: string,
  role: string,
  filters: IProjectFilters,
  pagination: IProjectPagination
) => {
  const roleFilter =
    role === USER_ROLES.BUYER
      ? { buyer: userId }
      : { assignedTo: userId };

  return getAllProjects({ ...filters, ...roleFilter }, pagination);
};

const getOpenProjects = async (
  filters: IProjectFilters,
  pagination: IProjectPagination
) => {
  return getAllProjects({ ...filters, status: PROJECT_STATUS.OPEN }, pagination);
};

const updateProject = async (
  projectId: string,
  userId: string,
  payload: Partial<IProject>
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (project.buyer.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only update your own projects");
  }

  if (
    project.status !== PROJECT_STATUS.OPEN &&
    project.status !== PROJECT_STATUS.ASSIGNED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot update project in current status"
    );
  }

  const { buyer, assignedTo, status, applicantsCount, ...updateData } = payload as Record<string, unknown>;

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("buyer", "name email profileImage")
    .populate("assignedTo", "name email profileImage skills");

  return updatedProject;
};

const updateProjectStatus = async (
  projectId: string,
  userId: string,
  userRole: string,
  newStatus: string
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isOwner = project.buyer.toString() === userId;
  const isAssigned = project.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  const allowedTransitions: Record<string, { to: string[]; by: string[] }> = {
    [PROJECT_STATUS.OPEN]: {
      to: [PROJECT_STATUS.ASSIGNED, PROJECT_STATUS.CANCELLED],
      by: ["buyer", "admin"],
    },
    [PROJECT_STATUS.ASSIGNED]: {
      to: [PROJECT_STATUS.IN_PROGRESS, PROJECT_STATUS.OPEN, PROJECT_STATUS.CANCELLED],
      by: ["buyer", "problem_solver", "admin"],
    },
    [PROJECT_STATUS.IN_PROGRESS]: {
      to: [PROJECT_STATUS.COMPLETED, PROJECT_STATUS.CANCELLED],
      by: ["buyer", "admin"],
    },
    [PROJECT_STATUS.COMPLETED]: {
      to: [],
      by: [],
    },
    [PROJECT_STATUS.CANCELLED]: {
      to: [],
      by: [],
    },
  };

  const currentTransition = allowedTransitions[project.status];

  if (!currentTransition.to.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot transition from ${project.status} to ${newStatus}`
    );
  }

  const canTransition =
    isAdmin ||
    (isOwner && currentTransition.by.includes("buyer")) ||
    (isAssigned && currentTransition.by.includes("problem_solver"));

  if (!canTransition) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to change this project status"
    );
  }

  if (newStatus === PROJECT_STATUS.IN_PROGRESS && !project.assignedTo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot start project without an assigned problem solver"
    );
  }

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === PROJECT_STATUS.IN_PROGRESS && !project.timeline.startDate) {
    updateData["timeline.startDate"] = new Date();
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $set: updateData },
    { new: true }
  )
    .populate("buyer", "name email profileImage")
    .populate("assignedTo", "name email profileImage skills");

  return updatedProject;
};

const assignProject = async (
  projectId: string,
  buyerId: string,
  problemSolverId: string
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (project.buyer.toString() !== buyerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the project owner can assign");
  }

  if (project.status !== PROJECT_STATUS.OPEN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can only assign open projects"
    );
  }

  const problemSolver = await User.findById(problemSolverId);
  if (!problemSolver) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem solver not found");
  }

  if (problemSolver.role !== USER_ROLES.PROBLEM_SOLVER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is not a problem solver"
    );
  }

  if (problemSolver.status !== "active") {
    throw new AppError(httpStatus.BAD_REQUEST, "Problem solver account is not active");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        assignedTo: problemSolverId,
        status: PROJECT_STATUS.ASSIGNED,
      },
    },
    { new: true }
  )
    .populate("buyer", "name email profileImage")
    .populate("assignedTo", "name email profileImage skills");

  return updatedProject;
};

const unassignProject = async (projectId: string, userId: string, userRole: string) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isOwner = project.buyer.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to unassign this project");
  }

  if (project.status !== PROJECT_STATUS.ASSIGNED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can only unassign projects in assigned status"
    );
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        assignedTo: null,
        status: PROJECT_STATUS.OPEN,
      },
    },
    { new: true }
  )
    .populate("buyer", "name email profileImage");

  return updatedProject;
};

const deleteProject = async (projectId: string, userId: string, userRole: string) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isOwner = project.buyer.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to delete this project");
  }

  if (
    project.status !== PROJECT_STATUS.OPEN &&
    project.status !== PROJECT_STATUS.CANCELLED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can only delete open or cancelled projects"
    );
  }

  await Project.findByIdAndUpdate(projectId, { $set: { isDeleted: true } });

  return null;
};

export const ProjectService = {
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
