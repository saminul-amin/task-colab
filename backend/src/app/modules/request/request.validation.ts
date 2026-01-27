import { z } from "zod";
import { requestStatusValues } from "./request.constant";

const createRequestValidationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    coverLetter: z
      .string()
      .min(1, "Cover letter is required")
      .min(20, "Cover letter must be at least 20 characters")
      .max(2000, "Cover letter cannot exceed 2000 characters"),
    proposedBudget: z.number().min(0, "Budget cannot be negative").optional(),
    proposedTimeline: z.number().min(1, "Timeline must be at least 1 day").optional(),
  }),
});

const updateRequestValidationSchema = z.object({
  body: z.object({
    coverLetter: z
      .string()
      .min(20, "Cover letter must be at least 20 characters")
      .max(2000, "Cover letter cannot exceed 2000 characters")
      .optional(),
    proposedBudget: z.number().min(0, "Budget cannot be negative").optional(),
    proposedTimeline: z.number().min(1, "Timeline must be at least 1 day").optional(),
  }),
});

const updateRequestStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(requestStatusValues as [string, ...string[]], {
      message: "Invalid status",
    }),
    rejectionReason: z.string().optional(),
  }),
});

const getRequestsValidationSchema = z.object({
  query: z.object({
    project: z.string().optional(),
    problemSolver: z.string().optional(),
    status: z
      .enum(requestStatusValues as [string, ...string[]], {
        message: "Invalid status",
      })
      .optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const RequestValidation = {
  createRequestValidationSchema,
  updateRequestValidationSchema,
  updateRequestStatusValidationSchema,
  getRequestsValidationSchema,
};
