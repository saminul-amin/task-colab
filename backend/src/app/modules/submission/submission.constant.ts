export const SUBMISSION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  REVISION_REQUESTED: "revision_requested",
} as const;

export type TSubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const submissionStatusValues = Object.values(SUBMISSION_STATUS);

export const ALLOWED_FILE_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-zip",
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
