import { z } from "zod";
import { taskStatusValues, taskPriorityValues } from "./task.constant";

const createTaskValidationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters"),
    priority: z
      .enum(taskPriorityValues as [string, ...string[]], {
        message: "Invalid priority",
      })
      .optional(),
    timeline: z.object({
      startDate: z.string().datetime().optional(),
      dueDate: z.string().min(1, "Due date is required").datetime(),
    }),
    estimatedHours: z.number().min(0, "Estimated hours cannot be negative").optional(),
  }),
});

const updateTaskValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    priority: z
      .enum(taskPriorityValues as [string, ...string[]], {
        message: "Invalid priority",
      })
      .optional(),
    timeline: z
      .object({
        startDate: z.string().datetime().optional(),
        dueDate: z.string().datetime().optional(),
      })
      .optional(),
    estimatedHours: z.number().min(0, "Estimated hours cannot be negative").optional(),
    actualHours: z.number().min(0, "Actual hours cannot be negative").optional(),
  }),
});

const updateTaskStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(taskStatusValues as [string, ...string[]], {
      message: "Invalid status",
    }),
  }),
});

const reorderTasksValidationSchema = z.object({
  body: z.object({
    taskIds: z.array(z.string()).min(1, "Task IDs are required"),
  }),
});

const getTasksValidationSchema = z.object({
  query: z.object({
    project: z.string().optional(),
    status: z
      .enum(taskStatusValues as [string, ...string[]], {
        message: "Invalid status",
      })
      .optional(),
    priority: z
      .enum(taskPriorityValues as [string, ...string[]], {
        message: "Invalid priority",
      })
      .optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const TaskValidation = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
  updateTaskStatusValidationSchema,
  reorderTasksValidationSchema,
  getTasksValidationSchema,
};
