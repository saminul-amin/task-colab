import { api } from "@/lib/api";
import { User } from "@/types";

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

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
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

  async updateProfile(payload: UpdateProfilePayload) {
    return api.patch<User>("/api/auth/me", payload);
  },

  async changePassword(payload: ChangePasswordPayload) {
    return api.post("/api/auth/change-password", payload);
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
