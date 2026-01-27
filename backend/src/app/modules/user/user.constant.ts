export const USER_ROLES = {
  ADMIN: "admin",
  BUYER: "buyer",
  PROBLEM_SOLVER: "problem_solver",
} as const;

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_STATUS = {
  ACTIVE: "active",
  BLOCKED: "blocked",
} as const;

export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
