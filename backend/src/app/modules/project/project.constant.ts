export const PROJECT_STATUS = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type TProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_CATEGORY = {
  WEB_DEVELOPMENT: "web_development",
  MOBILE_DEVELOPMENT: "mobile_development",
  DESKTOP_APPLICATION: "desktop_application",
  API_DEVELOPMENT: "api_development",
  DATABASE_DESIGN: "database_design",
  UI_UX_DESIGN: "ui_ux_design",
  DATA_ANALYSIS: "data_analysis",
  MACHINE_LEARNING: "machine_learning",
  DEVOPS: "devops",
  OTHER: "other",
} as const;

export type TProjectCategory = (typeof PROJECT_CATEGORY)[keyof typeof PROJECT_CATEGORY];

export const PROJECT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TProjectPriority = (typeof PROJECT_PRIORITY)[keyof typeof PROJECT_PRIORITY];

export const projectStatusValues = Object.values(PROJECT_STATUS);
export const projectCategoryValues = Object.values(PROJECT_CATEGORY);
export const projectPriorityValues = Object.values(PROJECT_PRIORITY);
