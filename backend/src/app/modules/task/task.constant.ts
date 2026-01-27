export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  COMPLETED: "completed",
} as const;

export type TTaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TTaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export const taskStatusValues = Object.values(TASK_STATUS);
export const taskPriorityValues = Object.values(TASK_PRIORITY);
