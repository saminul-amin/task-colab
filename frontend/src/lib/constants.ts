export const APP_NAME = "Task Colab";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ROLES = {
  ADMIN: "admin",
  BUYER: "buyer",
  PROBLEM_SOLVER: "problem_solver",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
