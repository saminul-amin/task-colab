import { api } from "@/lib/api";
import {
  Project,
  ProjectFilters,
  PaginationParams,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectStatus,
} from "@/types";

export const projectService = {
  async getOpenProjects(filters?: ProjectFilters, pagination?: PaginationParams) {
    const queryParams = new URLSearchParams();
    
    if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.minBudget) queryParams.append("minBudget", filters.minBudget.toString());
    if (filters?.maxBudget) queryParams.append("maxBudget", filters.maxBudget.toString());
    if (filters?.tags?.length) queryParams.append("tags", filters.tags.join(","));
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    return api.get<Project[]>(`/api/projects/open${query ? `?${query}` : ""}`);
  },

  async getAllProjects(filters?: ProjectFilters, pagination?: PaginationParams) {
    const queryParams = new URLSearchParams();
    
    if (filters?.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.buyer) queryParams.append("buyer", filters.buyer);
    if (filters?.assignedTo) queryParams.append("assignedTo", filters.assignedTo);
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    return api.get<Project[]>(`/api/projects${query ? `?${query}` : ""}`);
  },

  async getMyProjects(filters?: ProjectFilters, pagination?: PaginationParams) {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    return api.get<Project[]>(`/api/projects/my-projects${query ? `?${query}` : ""}`);
  },

  async getProjectById(id: string) {
    return api.get<Project>(`/api/projects/${id}`);
  },

  async createProject(payload: CreateProjectPayload) {
    return api.post<Project>("/api/projects", payload);
  },

  async updateProject(id: string, payload: UpdateProjectPayload) {
    return api.patch<Project>(`/api/projects/${id}`, payload);
  },

  async updateProjectStatus(id: string, status: ProjectStatus) {
    return api.patch<Project>(`/api/projects/${id}/status`, { status });
  },

  async assignProject(projectId: string, problemSolverId: string) {
    return api.patch<Project>(`/api/projects/${projectId}/assign`, {
      problemSolverId,
    });
  },

  async unassignProject(projectId: string) {
    return api.patch<Project>(`/api/projects/${projectId}/unassign`);
  },

  async deleteProject(id: string) {
    return api.delete<Project>(`/api/projects/${id}`);
  },
};
