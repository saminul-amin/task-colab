import { Document, Model, Types } from "mongoose";
import { TRequestStatus } from "./request.constant";

export interface IRequest {
  project: Types.ObjectId;
  problemSolver: Types.ObjectId;
  coverLetter: string;
  proposedBudget?: number;
  proposedTimeline?: number; // in days
  status: TRequestStatus;
  rejectionReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRequestDocument extends IRequest, Document {
  _id: Types.ObjectId;
}

export interface IRequestModel extends Model<IRequestDocument> {
  isRequestExists(id: string): Promise<IRequestDocument | null>;
  hasUserRequested(projectId: string, userId: string): Promise<boolean>;
}

export interface IRequestFilters {
  project?: string;
  problemSolver?: string;
  status?: TRequestStatus;
}

export interface IRequestPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
