import { z } from "zod";

export const loginValidation = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const registerValidation = z.object({
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
    role: z
      .enum(["buyer", "problem_solver"])
      .optional()
      .default("problem_solver"),
  }),
});

export const googleAuthValidation = z.object({
  body: z.object({
    googleId: z.string().min(1, "Google ID is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),
    profileImage: z.string().url().optional(),
    role: z
      .enum(["buyer", "problem_solver"])
      .optional()
      .default("problem_solver"),
  }),
});

export const changePasswordValidation = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password cannot exceed 50 characters"),
  }),
});

export const AuthValidation = {
  loginValidation,
  registerValidation,
  googleAuthValidation,
  changePasswordValidation,
};
