import { z } from "zod";
import {
  projectStatusValues,
  projectCategoryValues,
  projectPriorityValues,
} from "./project.constant";

const attachmentSchema = z.object({
  name: z.string().min(1, "Attachment name is required"),
  url: z.string().url("Invalid attachment URL"),
  type: z.string().min(1, "Attachment type is required"),
});

const createProjectValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(20, "Description must be at least 20 characters"),
    category: z.enum(projectCategoryValues as [string, ...string[]], {
      message: "Invalid category",
    }),
    priority: z
      .enum(projectPriorityValues as [string, ...string[]], {
        message: "Invalid priority",
      })
      .optional(),
    budget: z.object({
      min: z
        .number()
        .min(0, "Budget cannot be negative"),
      max: z
        .number()
        .min(0, "Budget cannot be negative"),
      currency: z.string().default("USD"),
    }).refine((data) => data.max >= data.min, {
      message: "Maximum budget must be greater than or equal to minimum budget",
      path: ["max"],
    }),
    timeline: z.object({
      startDate: z.string().datetime().optional(),
      deadline: z.string().min(1, "Deadline is required").datetime(),
      estimatedDuration: z.number().positive().optional(),
    }),
    requirements: z.array(z.string()).optional(),
    attachments: z.array(attachmentSchema).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .optional(),
    category: z
      .enum(projectCategoryValues as [string, ...string[]], {
        message: "Invalid category",
      })
      .optional(),
    priority: z
      .enum(projectPriorityValues as [string, ...string[]], {
        message: "Invalid priority",
      })
      .optional(),
    budget: z
      .object({
        min: z.number().min(0, "Budget cannot be negative").optional(),
        max: z.number().min(0, "Budget cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    timeline: z
      .object({
        startDate: z.string().datetime().optional(),
        deadline: z.string().datetime().optional(),
        estimatedDuration: z.number().positive().optional(),
      })
      .optional(),
    requirements: z.array(z.string()).optional(),
    attachments: z.array(attachmentSchema).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateProjectStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(projectStatusValues as [string, ...string[]], {
      message: "Invalid status",
    }),
  }),
});

const assignProjectValidationSchema = z.object({
  body: z.object({
    problemSolverId: z.string().min(1, "Problem solver ID is required"),
  }),
});

const getProjectsValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    status: z
      .enum(projectStatusValues as [string, ...string[]], {
        message: "Invalid status",
      })
      .optional(),
    category: z
      .enum(projectCategoryValues as [string, ...string[]], {
        message: "Invalid category",
      })
      .optional(),
    priority: z
      .enum(projectPriorityValues as [string, ...string[]], {
        message: "Invalid priority",
      })
      .optional(),
    minBudget: z.string().transform(Number).optional(),
    maxBudget: z.string().transform(Number).optional(),
    buyer: z.string().optional(),
    assignedTo: z.string().optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const ProjectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
  updateProjectStatusValidationSchema,
  assignProjectValidationSchema,
  getProjectsValidationSchema,
};
