export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "buyer" | "problem_solver";
}

export interface IGoogleAuthPayload {
  googleId: string;
  email: string;
  name: string;
  profileImage?: string;
  role?: "buyer" | "problem_solver";
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
