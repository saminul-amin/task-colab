import { API_BASE_URL } from "@/lib/constants";
import {
  Submission,
  SubmissionFilters,
  PaginationParams,
  ReviewSubmissionPayload,
  ApiResponse,
} from "@/types";

const getAuthHeader = (): HeadersInit => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submissionService = {
  async getTaskSubmissions(
    taskId: string,
    filters?: SubmissionFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Submission[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    const response = await fetch(
      `${API_BASE_URL}/api/submissions/task/${taskId}${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    return response.json();
  },

  async getProjectSubmissions(
    projectId: string,
    filters?: SubmissionFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Submission[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    
    if (pagination?.page) queryParams.append("page", pagination.page.toString());
    if (pagination?.limit) queryParams.append("limit", pagination.limit.toString());
    if (pagination?.sortBy) queryParams.append("sortBy", pagination.sortBy);
    if (pagination?.sortOrder) queryParams.append("sortOrder", pagination.sortOrder);

    const query = queryParams.toString();
    const response = await fetch(
      `${API_BASE_URL}/api/submissions/project/${projectId}${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    return response.json();
  },

  async getSubmissionById(id: string): Promise<ApiResponse<Submission>> {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.json();
  },

  async createSubmission(
    taskId: string,
    file: File,
    description: string
  ): Promise<ApiResponse<Submission>> {
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("file", file);
    formData.append("description", description);

    const headers: HeadersInit = { ...getAuthHeader() };

    const response = await fetch(`${API_BASE_URL}/api/submissions`, {
      method: "POST",
      headers,
      body: formData,
    });
    return response.json();
  },

  async reviewSubmission(
    id: string,
    payload: ReviewSubmissionPayload
  ): Promise<ApiResponse<Submission>> {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async deleteSubmission(id: string): Promise<ApiResponse<Submission>> {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.json();
  },

  getFileDownloadUrl(fileUrl: string): string {
    if (fileUrl.startsWith("http")) return fileUrl;
    return `${API_BASE_URL}${fileUrl}`;
  },
};
