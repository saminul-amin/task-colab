import { api } from "@/lib/api";
import { User, ApiResponse, PaginationParams } from "@/types";

export interface UpdateUserPayload {
  name?: string;
  bio?: string;
  skills?: string[];
  profileImage?: string;
}

export interface UpdateUserRolePayload {
  role: "admin" | "buyer" | "problem_solver";
}

export interface UpdateUserStatusPayload {
  status: "active" | "blocked";
}

export const userService = {
  async getAllUsers(params?: PaginationParams) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const query = queryParams.toString();
    return api.get<User[]>(`/api/users${query ? `?${query}` : ""}`);
  },

  async getUserById(id: string) {
    return api.get<User>(`/api/users/${id}`);
  },

  async updateUser(id: string, payload: UpdateUserPayload) {
    return api.patch<User>(`/api/users/${id}`, payload);
  },

  async updateUserRole(id: string, payload: UpdateUserRolePayload) {
    return api.patch<User>(`/api/users/${id}`, payload);
  },

  async updateUserStatus(id: string, payload: UpdateUserStatusPayload) {
    return api.patch<User>(`/api/users/${id}`, payload);
  },

  async deleteUser(id: string) {
    return api.delete<User>(`/api/users/${id}`);
  },
};
