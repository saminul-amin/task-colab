import { api } from "@/lib/api";
import {
  Request,
  RequestFilters,
  PaginationParams,
  CreateRequestPayload,
} from "@/types";

export const requestService = {
  async getMyRequests(filters?: RequestFilters, pagination?: PaginationParams) {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    return api.get<Request[]>(`/api/requests/my-requests${query ? `?${query}` : ""}`);
  },

  async getProjectRequests(projectId: string, pagination?: PaginationParams) {
    const queryParams = new URLSearchParams();
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    return api.get<Request[]>(`/api/requests/project/${projectId}${query ? `?${query}` : ""}`);
  },

  async getRequestById(id: string) {
    return api.get<Request>(`/api/requests/${id}`);
  },

  async createRequest(payload: CreateRequestPayload) {
    return api.post<Request>("/api/requests", payload);
  },

  async updateRequest(id: string, payload: Partial<CreateRequestPayload>) {
    return api.patch<Request>(`/api/requests/${id}`, payload);
  },

  async acceptRequest(id: string) {
    return api.post<Request>(`/api/requests/${id}/accept`);
  },

  async rejectRequest(id: string, reason?: string) {
    return api.post<Request>(`/api/requests/${id}/reject`, { rejectionReason: reason });
  },

  async withdrawRequest(id: string) {
    return api.post<Request>(`/api/requests/${id}/withdraw`);
  },

  async deleteRequest(id: string) {
    return api.delete<Request>(`/api/requests/${id}`);
  },
};
