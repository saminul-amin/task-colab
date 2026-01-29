import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { AppError, createToken } from "../../utils";
import { envVars } from "../../config/env";
import { uploadToCloudinary } from "../../config/cloudinary";
import {
  IAuthResponse,
  IChangePasswordPayload,
  IGoogleAuthPayload,
  IJwtPayload,
  ILoginPayload,
  IRegisterPayload,
  IUpdateProfilePayload,
} from "./auth.interface";
import { USER_ROLES, USER_STATUS } from "../user/user.constant";

const register = async (payload: IRegisterPayload): Promise<IAuthResponse> => {
  const existingUser = await User.isUserExistsByEmail(payload.email);
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
  }

  // Default to problem_solver if no role specified, and prevent admin registration
  const role = payload.role === "buyer" ? USER_ROLES.BUYER : USER_ROLES.PROBLEM_SOLVER;

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role,
    authProvider: "local",
  });

  const jwtPayload: IJwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const login = async (payload: ILoginPayload): Promise<IAuthResponse> => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted");
  }

  if (user.status === USER_STATUS.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This account has been blocked");
  }

  // Check if user signed up with Google
  if (user.authProvider === "google" && !user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account uses Google Sign-In. Please sign in with Google."
    );
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    user.password!
  );
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload: IJwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const googleAuth = async (payload: IGoogleAuthPayload): Promise<IAuthResponse> => {
  // Check if user already exists with this Google ID
  let user = await User.isUserExistsByGoogleId(payload.googleId);

  if (!user) {
    // Check if email already exists (user signed up with email/password)
    const existingEmailUser = await User.isUserExistsByEmail(payload.email);
    
    if (existingEmailUser) {
      // Link Google account to existing user
      existingEmailUser.googleId = payload.googleId;
      if (!existingEmailUser.profileImage && payload.profileImage) {
        existingEmailUser.profileImage = payload.profileImage;
      }
      await existingEmailUser.save();
      user = existingEmailUser;
    } else {
      // Create new user with Google account
      const role = payload.role === "buyer" ? USER_ROLES.BUYER : USER_ROLES.PROBLEM_SOLVER;
      
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.googleId,
        profileImage: payload.profileImage,
        role,
        authProvider: "google",
      });
    }
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted");
  }

  if (user.status === USER_STATUS.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This account has been blocked");
  }

  const jwtPayload: IJwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN
  );

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload
): Promise<void> => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await User.isPasswordMatched(
    payload.currentPassword,
    user.password
  );
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
  }

  user.password = payload.newPassword;
  await user.save();
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const updateProfile = async (
  userId: string,
  payload: IUpdateProfilePayload,
  file?: Express.Multer.File
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Handle profile image upload
  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer);
    payload.profileImage = uploadResult.url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

export const AuthService = {
  register,
  login,
  googleAuth,
  changePassword,
  getMe,
  updateProfile,
};
