export type TLoginAuth = {
  email: string;
  password: string;
};

import { Model } from "mongoose";
import { UserRole } from "./auth.constants";

export type TUser = {
  userId: string;
  _id: string;
  avatar?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password: string;
  role: "user" | "admin" | "moderator";
  isDeleted?: boolean;
  isSuspended?: boolean;
  isOtpVerified?: boolean;
  otp?: string | null;
  otpExpireAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof UserRole;
