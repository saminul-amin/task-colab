import { api } from "@/lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "buyer" | "problem_solver";
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "buyer" | "problem_solver";
  status: "active" | "blocked";
  bio?: string;
  skills?: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    return api.post<AuthResponse>("/api/auth/login", payload);
  },

  async register(payload: RegisterPayload) {
    return api.post<AuthResponse>("/api/auth/register", payload);
  },

  async getMe() {
    return api.get<User>("/api/auth/me");
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return api.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setAuth(token: string, user: AuthResponse["user"]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
