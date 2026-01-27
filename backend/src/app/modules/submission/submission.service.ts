import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { ISubmission, ISubmissionFilters, ISubmissionPagination } from "./submission.interface";
import { Submission } from "./submission.model";
import { SUBMISSION_STATUS } from "./submission.constant";
import { Task } from "../task/task.model";
import { TASK_STATUS } from "../task/task.constant";
import { Project } from "../project/project.model";
import { USER_ROLES } from "../user/user.constant";

const createSubmission = async (
  userId: string,
  payload: {
    taskId: string;
    description: string;
    file: {
      name: string;
      url: string;
      size: number;
      mimeType: string;
    };
  }
) => {
  const task = await Task.findById(payload.taskId).populate("project");
  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const project = task.project as unknown as {
    _id: { toString: () => string };
    assignedTo?: { toString: () => string };
  };

  if (project.assignedTo?.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not assigned to this project");
  }

  if (task.status !== TASK_STATUS.IN_PROGRESS && task.status !== TASK_STATUS.TODO) {
    throw new AppError(httpStatus.BAD_REQUEST, "Task is not in a submittable state");
  }

  const latestSubmission = await Submission.getLatestSubmission(payload.taskId);
  const newVersion = latestSubmission ? latestSubmission.version + 1 : 1;

  const submissionData = {
    task: payload.taskId,
    project: project._id,
    submittedBy: userId,
    file: payload.file,
    description: payload.description,
    status: SUBMISSION_STATUS.PENDING,
    version: newVersion,
  };

  const submission = await Submission.create(submissionData);

  await Task.findByIdAndUpdate(payload.taskId, {
    $set: { status: TASK_STATUS.REVIEW },
  });

  return submission.populate([
    { path: "task", select: "title status" },
    { path: "project", select: "title" },
    { path: "submittedBy", select: "name email" },
  ]);
};

const getSubmissionsForTask = async (
  taskId: string,
  userId: string,
  userRole: string,
  pagination: ISubmissionPagination
) => {
  const task = await Task.findById(taskId).populate("project");
  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const project = task.project as unknown as {
    buyer: { toString: () => string };
    assignedTo?: { toString: () => string };
  };

  const isBuyer = project.buyer.toString() === userId;
  const isAssigned = project.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isBuyer && !isAssigned && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view submissions");
  }

  const { page = 1, limit = 10, sortBy = "version", sortOrder = "desc" } = pagination;

  const skip = (page - 1) * limit;
  const sortCondition: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [submissions, total] = await Promise.all([
    Submission.find({ task: taskId })
      .populate("submittedBy", "name email profileImage")
      .populate("reviewedBy", "name email")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean(),
    Submission.countDocuments({ task: taskId }),
  ]);

  return {
    data: submissions,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getSubmissionsForProject = async (
  projectId: string,
  userId: string,
  userRole: string,
  filters: ISubmissionFilters,
  pagination: ISubmissionPagination
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const isBuyer = project.buyer.toString() === userId;
  const isAssigned = project.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isBuyer && !isAssigned && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view submissions");
  }

  const { status } = filters;
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = pagination;

  const conditions: Record<string, unknown> = { project: projectId };
  if (status) conditions.status = status;

  const skip = (page - 1) * limit;
  const sortCondition: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [submissions, total] = await Promise.all([
    Submission.find(conditions)
      .populate("task", "title status")
      .populate("submittedBy", "name email profileImage")
      .populate("reviewedBy", "name email")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean(),
    Submission.countDocuments(conditions),
  ]);

  return {
    data: submissions,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getSubmissionById = async (submissionId: string, userId: string, userRole: string) => {
  const submission = await Submission.findById(submissionId)
    .populate("task", "title status description")
    .populate("project", "title buyer assignedTo")
    .populate("submittedBy", "name email profileImage")
    .populate("reviewedBy", "name email");

  if (!submission) {
    throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
  }

  const projectDoc = submission.project as unknown as {
    buyer: { toString: () => string };
    assignedTo?: { toString: () => string };
  };

  const isBuyer = projectDoc.buyer.toString() === userId;
  const isAssigned = projectDoc.assignedTo?.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isBuyer && !isAssigned && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view this submission");
  }

  return submission;
};

const reviewSubmission = async (
  submissionId: string,
  buyerId: string,
  userRole: string,
  payload: { status: string; feedback?: string }
) => {
  const submission = await Submission.findById(submissionId).populate("project").populate("task");

  if (!submission) {
    throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
  }

  const project = submission.project as unknown as {
    buyer: { toString: () => string };
  };

  const isBuyer = project.buyer.toString() === buyerId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isBuyer && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Only the project buyer can review submissions");
  }

  if (submission.status !== SUBMISSION_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Submission has already been reviewed");
  }

  submission.status = payload.status as ISubmission["status"];
  submission.feedback = payload.feedback || undefined;
  submission.reviewedBy = buyerId as unknown as ISubmission["reviewedBy"];
  submission.reviewedAt = new Date();
  await submission.save();

  const task = submission.task as unknown as { _id: string };
  if (payload.status === SUBMISSION_STATUS.ACCEPTED) {
    await Task.findByIdAndUpdate(task._id, {
      $set: { status: TASK_STATUS.COMPLETED },
    });
  } else if (
    payload.status === SUBMISSION_STATUS.REJECTED ||
    payload.status === SUBMISSION_STATUS.REVISION_REQUESTED
  ) {
    await Task.findByIdAndUpdate(task._id, {
      $set: { status: TASK_STATUS.IN_PROGRESS },
    });
  }

  return Submission.findById(submissionId)
    .populate("task", "title status")
    .populate("project", "title")
    .populate("submittedBy", "name email")
    .populate("reviewedBy", "name email");
};

const deleteSubmission = async (submissionId: string, userId: string, userRole: string) => {
  const submission = await Submission.findById(submissionId).populate("project");

  if (!submission) {
    throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
  }

  const project = submission.project as unknown as {
    assignedTo?: { toString: () => string };
  };

  const isSubmitter = submission.submittedBy.toString() === userId;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  if (!isSubmitter && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to delete this submission");
  }

  if (submission.status !== SUBMISSION_STATUS.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete reviewed submissions");
  }

  await Submission.findByIdAndUpdate(submissionId, { $set: { isDeleted: true } });

  return null;
};

export const SubmissionService = {
  createSubmission,
  getSubmissionsForTask,
  getSubmissionsForProject,
  getSubmissionById,
  reviewSubmission,
  deleteSubmission,
};
