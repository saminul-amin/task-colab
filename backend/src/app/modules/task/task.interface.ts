import { Document, Model, Types } from "mongoose";
import { TTaskPriority, TTaskStatus } from "./task.constant";

export interface ITask {
  project: Types.ObjectId;
  createdBy: Types.ObjectId;
  title: string;
  description: string;
  status: TTaskStatus;
  priority: TTaskPriority;
  timeline: {
    startDate?: Date;
    dueDate: Date;
  };
  order: number;
  estimatedHours?: number;
  actualHours?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDocument extends ITask, Document {
  _id: Types.ObjectId;
}

export interface ITaskModel extends Model<ITaskDocument> {
  isTaskExists(id: string): Promise<ITaskDocument | null>;
}

export interface ITaskFilters {
  project?: string;
  status?: TTaskStatus;
  priority?: TTaskPriority;
  createdBy?: string;
}

export interface ITaskPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
