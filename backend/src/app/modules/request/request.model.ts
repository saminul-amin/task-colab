import { Schema, model } from "mongoose";
import { REQUEST_STATUS, requestStatusValues } from "./request.constant";
import { IRequestDocument, IRequestModel } from "./request.interface";

const requestSchema = new Schema<IRequestDocument, IRequestModel>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    problemSolver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Problem solver is required"],
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
      minlength: [20, "Cover letter must be at least 20 characters"],
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    proposedBudget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
      default: null,
    },
    proposedTimeline: {
      type: Number,
      min: [1, "Timeline must be at least 1 day"],
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: requestStatusValues,
        message: "{VALUE} is not a valid status",
      },
      default: REQUEST_STATUS.PENDING,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

requestSchema.index({ project: 1, problemSolver: 1 }, { unique: true });
requestSchema.index({ project: 1, status: 1 });
requestSchema.index({ problemSolver: 1 });
requestSchema.index({ createdAt: -1 });

requestSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

requestSchema.pre("findOne", function () {
  this.where({ isDeleted: { $ne: true } });
});

requestSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: { $ne: true } });
});

requestSchema.statics.isRequestExists = async function (
  id: string
): Promise<IRequestDocument | null> {
  return this.findById(id);
};

requestSchema.statics.hasUserRequested = async function (
  projectId: string,
  userId: string
): Promise<boolean> {
  const request = await this.findOne({
    project: projectId,
    problemSolver: userId,
    status: { $ne: "withdrawn" },
  });
  return !!request;
};

export const Request = model<IRequestDocument, IRequestModel>("Request", requestSchema);
