import { api } from "@/lib/api";
import {
  Task,
  TaskFilters,
  PaginationParams,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
} from "@/types";

export const taskService = {
  async getProjectTasks(projectId: string, filters?: TaskFilters, pagination?: PaginationParams) {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    return api.get<Task[]>(`/api/tasks/project/${projectId}${query ? `?${query}` : ""}`);
  },

  async getTaskById(id: string) {
    return api.get<Task>(`/api/tasks/${id}`);
  },

  async createTask(payload: CreateTaskPayload) {
    return api.post<Task>("/api/tasks", payload);
  },

  async updateTask(id: string, payload: UpdateTaskPayload) {
    return api.patch<Task>(`/api/tasks/${id}`, payload);
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    return api.patch<Task>(`/api/tasks/${id}/status`, { status });
  },

  async reorderTasks(projectId: string, taskIds: string[]) {
    return api.post<Task[]>(`/api/tasks/project/${projectId}/reorder`, { taskIds });
  },

  async deleteTask(id: string) {
    return api.delete<Task>(`/api/tasks/${id}`);
  },
};
