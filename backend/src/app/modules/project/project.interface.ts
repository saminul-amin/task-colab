import { Document, Model, Types } from "mongoose";
import { TProjectCategory, TProjectPriority, TProjectStatus } from "./project.constant";

export interface IProject {
  title: string;
  description: string;
  buyer: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  status: TProjectStatus;
  category: TProjectCategory;
  priority: TProjectPriority;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    startDate?: Date;
    deadline: Date;
    estimatedDuration?: number; // in days
  };
  requirements: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  tags: string[];
  applicantsCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends IProject, Document {
  _id: Types.ObjectId;
}

export interface IProjectModel extends Model<IProjectDocument> {
  isProjectExists(id: string): Promise<IProjectDocument | null>;
  isOwner(projectId: string, userId: string): Promise<boolean>;
}

export interface IProjectFilters {
  searchTerm?: string;
  status?: TProjectStatus;
  category?: TProjectCategory;
  priority?: TProjectPriority;
  minBudget?: number;
  maxBudget?: number;
  buyer?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface IProjectPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
