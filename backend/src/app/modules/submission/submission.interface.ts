import { Document, Model, Types } from "mongoose";
import { TSubmissionStatus } from "./submission.constant";

export interface ISubmission {
  task: Types.ObjectId;
  project: Types.ObjectId;
  submittedBy: Types.ObjectId;
  file: {
    name: string;
    url: string;
    size: number;
    mimeType: string;
  };
  description: string;
  status: TSubmissionStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  feedback?: string;
  version: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmissionDocument extends ISubmission, Document {
  _id: Types.ObjectId;
}

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  isSubmissionExists(id: string): Promise<ISubmissionDocument | null>;
  getLatestSubmission(taskId: string): Promise<ISubmissionDocument | null>;
}

export interface ISubmissionFilters {
  task?: string;
  project?: string;
  submittedBy?: string;
  status?: TSubmissionStatus;
}

export interface ISubmissionPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
