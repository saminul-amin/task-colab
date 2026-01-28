import { Document, Model } from "mongoose";
import { TUserRole, TUserStatus } from "./user.constant";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
  phone?: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  isDeleted: boolean;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  isUserExistsByEmail(email: string): Promise<IUserDocument | null>;
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
