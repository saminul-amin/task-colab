import { Schema, model } from "mongoose";
import {
  PROJECT_STATUS,
  PROJECT_CATEGORY,
  PROJECT_PRIORITY,
  projectStatusValues,
  projectCategoryValues,
  projectPriorityValues,
} from "./project.constant";
import { IProjectDocument, IProjectModel } from "./project.interface";

const projectSchema = new Schema<IProjectDocument, IProjectModel>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: projectStatusValues,
        message: "{VALUE} is not a valid status",
      },
      default: PROJECT_STATUS.OPEN,
    },
    category: {
      type: String,
      enum: {
        values: projectCategoryValues,
        message: "{VALUE} is not a valid category",
      },
      required: [true, "Project category is required"],
    },
    priority: {
      type: String,
      enum: {
        values: projectPriorityValues,
        message: "{VALUE} is not a valid priority",
      },
      default: PROJECT_PRIORITY.MEDIUM,
    },
    budget: {
      min: {
        type: Number,
        required: [true, "Minimum budget is required"],
        min: [0, "Budget cannot be negative"],
      },
      max: {
        type: Number,
        required: [true, "Maximum budget is required"],
        min: [0, "Budget cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
        uppercase: true,
      },
    },
    timeline: {
      startDate: {
        type: Date,
        default: null,
      },
      deadline: {
        type: Date,
        required: [true, "Project deadline is required"],
      },
      estimatedDuration: {
        type: Number,
        default: null,
      },
    },
    requirements: {
      type: [String],
      default: [],
    },
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    applicantsCount: {
      type: Number,
      default: 0,
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

projectSchema.index({ title: "text", description: "text", tags: "text" });
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ buyer: 1 });
projectSchema.index({ assignedTo: 1 });
projectSchema.index({ "budget.min": 1, "budget.max": 1 });
projectSchema.index({ "timeline.deadline": 1 });
projectSchema.index({ createdAt: -1 });

projectSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

projectSchema.pre("findOne", function () {
  this.where({ isDeleted: { $ne: true } });
});

projectSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: { $ne: true } });
});

projectSchema.pre("save", function (next) {
  if (this.budget.max < this.budget.min) {
    const error = new Error("Maximum budget must be greater than or equal to minimum budget");
    return next(error);
  }
  next();
});

projectSchema.statics.isProjectExists = async function (
  id: string
): Promise<IProjectDocument | null> {
  return this.findById(id);
};

projectSchema.statics.isOwner = async function (
  projectId: string,
  userId: string
): Promise<boolean> {
  const project = await this.findById(projectId);
  return project?.buyer.toString() === userId;
};

export const Project = model<IProjectDocument, IProjectModel>("Project", projectSchema);
