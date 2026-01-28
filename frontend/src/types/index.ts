// User Types
export type UserRole = "admin" | "buyer" | "problem_solver";
export type UserStatus = "active" | "blocked";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  bio?: string;
  skills?: string[];
  profileImage?: string;
  rating?: number;
  projectsCreated?: number;
  projectsAssigned?: number;
  completedProjects?: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export type ProjectStatus = "open" | "assigned" | "in_progress" | "completed" | "cancelled";
export type ProjectCategory =
  | "web_development"
  | "mobile_development"
  | "desktop_application"
  | "api_development"
  | "database_design"
  | "ui_ux_design"
  | "data_analysis"
  | "machine_learning"
  | "devops"
  | "other";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface ProjectBudget {
  min: number;
  max: number;
  currency: string;
}

export interface ProjectTimeline {
  startDate?: string;
  deadline: string;
  estimatedDuration?: number;
}

export interface ProjectAttachment {
  name: string;
  url: string;
  type: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  buyer: User | string;
  assignedTo?: User | string;
  status: ProjectStatus;
  category: ProjectCategory;
  priority: ProjectPriority;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  requirements: string[];
  attachments: ProjectAttachment[];
  tags: string[];
  applicantsCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RequestStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Request {
  _id: string;
  project: Project | string;
  problemSolver: User | string;
  coverLetter: string;
  proposedBudget?: number;
  proposedTimeline?: number;
  status: RequestStatus;
  rejectionReason?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "todo" | "in_progress" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskTimeline {
  startDate?: string;
  dueDate: string;
}

export interface Task {
  _id: string;
  project: Project | string;
  createdBy: User | string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  timeline: TaskTimeline;
  order: number;
  estimatedHours?: number;
  actualHours?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "pending" | "accepted" | "rejected" | "revision_requested";

export interface SubmissionFile {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Submission {
  _id: string;
  task: Task | string;
  project: Project | string;
  submittedBy: User | string;
  file: SubmissionFile;
  description: string;
  status: SubmissionStatus;
  reviewedBy?: User | string;
  reviewedAt?: string;
  feedback?: string;
  version: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errorSources?: { path: string; message: string }[];
}

export interface ProjectFilters {
  searchTerm?: string;
  status?: ProjectStatus;
  category?: ProjectCategory;
  priority?: ProjectPriority;
  minBudget?: number;
  maxBudget?: number;
  buyer?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface TaskFilters {
  project?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  createdBy?: string;
}

export interface RequestFilters {
  project?: string;
  problemSolver?: string;
  status?: RequestStatus;
}

export interface SubmissionFilters {
  task?: string;
  project?: string;
  submittedBy?: string;
  status?: SubmissionStatus;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  category: ProjectCategory;
  priority: ProjectPriority;
  budget: ProjectBudget;
  timeline: {
    deadline: string;
    estimatedDuration?: number;
  };
  requirements: string[];
  tags: string[];
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  category?: ProjectCategory;
  priority?: ProjectPriority;
  budget?: ProjectBudget;
  timeline?: {
    deadline?: string;
    estimatedDuration?: number;
  };
  requirements?: string[];
  tags?: string[];
}

export interface CreateRequestPayload {
  project: string;
  coverLetter: string;
  proposedBudget?: number;
  proposedTimeline?: number;
}

export interface CreateTaskPayload {
  project: string;
  title: string;
  description: string;
  priority: TaskPriority;
  timeline: {
    dueDate: string;
    startDate?: string;
  };
  estimatedHours?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  timeline?: {
    dueDate?: string;
    startDate?: string;
  };
  estimatedHours?: number;
  actualHours?: number;
}

export interface ReviewSubmissionPayload {
  status: "accepted" | "rejected" | "revision_requested";
  feedback?: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  buyer: "Buyer",
  problem_solver: "Problem Solver",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  blocked: "Blocked",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  web_development: "Web Development",
  mobile_development: "Mobile Development",
  desktop_application: "Desktop Application",
  api_development: "API Development",
  database_design: "Database Design",
  ui_ux_design: "UI/UX Design",
  data_analysis: "Data Analysis",
  machine_learning: "Machine Learning",
  devops: "DevOps",
  other: "Other",
};

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "Pending Review",
  accepted: "Accepted",
  rejected: "Rejected",
  revision_requested: "Revision Requested",
};

// Message Types
export type MessageType = "text" | "file" | "system";

export interface MessageAttachment {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User | string;
  content: string;
  type: MessageType;
  attachment?: MessageAttachment;
  readBy: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  project: Pick<Project, "_id" | "title" | "status"> | string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessagePayload {
  conversationId: string;
  content: string;
  type?: MessageType;
}
