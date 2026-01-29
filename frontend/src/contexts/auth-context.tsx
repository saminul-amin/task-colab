"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  authService,
  LoginPayload,
  RegisterPayload,
  GoogleAuthPayload,
} from "@/services/auth.service";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  googleAuth: (payload: GoogleAuthPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await authService.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        authService.logout();
        setUser(null);
      }
    } catch (error) {
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload) => {
    try {
      const response = await authService.login(payload);
      if (response.success && response.data) {
        authService.setAuth(response.data.accessToken, response.data.user);
        await refreshUser();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (error) {
      return { success: false, message: "An error occurred during login" };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await authService.register(payload);
      if (response.success && response.data) {
        authService.setAuth(response.data.accessToken, response.data.user);
        await refreshUser();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (error) {
      return { success: false, message: "An error occurred during registration" };
    }
  };

  const googleAuth = async (payload: GoogleAuthPayload) => {
    try {
      const response = await authService.googleAuth(payload);
      if (response.success && response.data) {
        authService.setAuth(response.data.accessToken, response.data.user);
        await refreshUser();
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || "Google authentication failed" };
    } catch (error) {
      return { success: false, message: "An error occurred during Google authentication" };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        googleAuth,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
