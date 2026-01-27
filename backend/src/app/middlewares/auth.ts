import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { AppError, catchAsync, verifyToken } from "../utils";
import { TUserRole } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        email: string;
        role: TUserRole;
      };
    }
  }
}

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, envVars.JWT_SECRET);
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }

    const { id, email, role, iat } = decoded;

    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted");
    }

    if (user.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This account has been blocked");
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Your password was changed recently. Please login again"
      );
    }

    if (requiredRoles.length && !requiredRoles.includes(role as TUserRole)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to perform this action"
      );
    }

    req.user = {
      id,
      email,
      role,
    } as JwtPayload & { id: string; email: string; role: TUserRole };

    next();
  });
};
