import { Schema, model } from "mongoose";
import { SUBMISSION_STATUS, submissionStatusValues } from "./submission.constant";
import { ISubmissionDocument, ISubmissionModel } from "./submission.interface";

const submissionSchema = new Schema<ISubmissionDocument, ISubmissionModel>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task is required"],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Submitter is required"],
    },
    file: {
      name: {
        type: String,
        required: [true, "File name is required"],
      },
      url: {
        type: String,
        required: [true, "File URL is required"],
      },
      size: {
        type: Number,
        required: [true, "File size is required"],
      },
      mimeType: {
        type: String,
        required: [true, "File MIME type is required"],
      },
    },
    description: {
      type: String,
      required: [true, "Submission description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: submissionStatusValues,
        message: "{VALUE} is not a valid status",
      },
      default: SUBMISSION_STATUS.PENDING,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: null,
    },
    version: {
      type: Number,
      default: 1,
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

submissionSchema.index({ task: 1, version: -1 });
submissionSchema.index({ project: 1 });
submissionSchema.index({ submittedBy: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ createdAt: -1 });

submissionSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

submissionSchema.pre("findOne", function () {
  this.where({ isDeleted: { $ne: true } });
});

submissionSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: { $ne: true } });
});

submissionSchema.statics.isSubmissionExists = async function (
  id: string
): Promise<ISubmissionDocument | null> {
  return this.findById(id);
};

submissionSchema.statics.getLatestSubmission = async function (
  taskId: string
): Promise<ISubmissionDocument | null> {
  return this.findOne({ task: taskId }).sort({ version: -1 });
};

export const Submission = model<ISubmissionDocument, ISubmissionModel>(
  "Submission",
  submissionSchema
);
