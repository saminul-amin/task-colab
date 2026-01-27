export const REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
} as const;

export type TRequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const requestStatusValues = Object.values(REQUEST_STATUS);
