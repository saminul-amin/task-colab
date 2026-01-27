import { Schema, model } from "mongoose";
import { TASK_STATUS, TASK_PRIORITY, taskStatusValues, taskPriorityValues } from "./task.constant";
import { ITaskDocument, ITaskModel } from "./task.interface";

const taskSchema = new Schema<ITaskDocument, ITaskModel>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    status: {
      type: String,
      enum: {
        values: taskStatusValues,
        message: "{VALUE} is not a valid status",
      },
      default: TASK_STATUS.TODO,
    },
    priority: {
      type: String,
      enum: {
        values: taskPriorityValues,
        message: "{VALUE} is not a valid priority",
      },
      default: TASK_PRIORITY.MEDIUM,
    },
    timeline: {
      startDate: {
        type: Date,
        default: null,
      },
      dueDate: {
        type: Date,
        required: [true, "Due date is required"],
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
      default: null,
    },
    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
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

taskSchema.index({ project: 1, order: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ "timeline.dueDate": 1 });
taskSchema.index({ createdAt: -1 });

taskSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

taskSchema.pre("findOne", function () {
  this.where({ isDeleted: { $ne: true } });
});

taskSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: { $ne: true } });
});

taskSchema.statics.isTaskExists = async function (
  id: string
): Promise<ITaskDocument | null> {
  return this.findById(id);
};

export const Task = model<ITaskDocument, ITaskModel>("Task", taskSchema);
