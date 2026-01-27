import { z } from "zod";
import { submissionStatusValues } from "./submission.constant";

const createSubmissionValidationSchema = z.object({
  body: z.object({
    taskId: z.string().min(1, "Task ID is required"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description cannot exceed 2000 characters"),
  }),
});

const reviewSubmissionValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      [submissionStatusValues[1], submissionStatusValues[2], submissionStatusValues[3]] as [string, ...string[]],
      { message: "Invalid status. Must be accepted, rejected, or revision_requested" }
    ),
    feedback: z.string().optional(),
  }),
});

const getSubmissionsValidationSchema = z.object({
  query: z.object({
    task: z.string().optional(),
    project: z.string().optional(),
    status: z
      .enum(submissionStatusValues as [string, ...string[]], {
        message: "Invalid status",
      })
      .optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const SubmissionValidation = {
  createSubmissionValidationSchema,
  reviewSubmissionValidationSchema,
  getSubmissionsValidationSchema,
};
