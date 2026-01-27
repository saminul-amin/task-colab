import { z } from "zod";
import { USER_ROLES, USER_STATUS } from "./user.constant";

const userRoles = [USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER] as const;
const userStatuses = [USER_STATUS.ACTIVE, USER_STATUS.BLOCKED] as const;

export const createUserValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password cannot exceed 50 characters"),
    role: z.enum(userRoles).optional(),
  }),
});

export const updateUserValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    skills: z.array(z.string()).optional(),
    profileImage: z.string().url("Invalid URL format").optional(),
  }),
});

export const updateUserRoleValidation = z.object({
  body: z.object({
    role: z.enum(userRoles, { message: "Role is required" }),
  }),
});

export const updateUserStatusValidation = z.object({
  body: z.object({
    status: z.enum(userStatuses, { message: "Status is required" }),
  }),
});

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
  updateUserRoleValidation,
  updateUserStatusValidation,
};
