/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { TLoginAuth, TUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import { User } from "./auth.model";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const signup = async (
  payload: Partial<TUser>,
  file: Express.Multer.File | undefined
) => {
  // Checking if user already exists
  const isUserExists = await User.findOne({ email: payload.email });
  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, "User already exists.");
  }

  let imageUrl = "";

  if (file) {
    const imageName = `${payload.name}-${Date.now()}`;
    const path = file.path;

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    imageUrl = secure_url;
  }

  const payloadData = {
    ...payload,
    avatar: imageUrl,
    isDeleted: false,
    isSuspended: false,
  };

  const result = await User.create(payloadData);
  return result;
};

// Login
const loginUser = async (payload: TLoginAuth) => {
  // Checking if the user exists or not
  const user = await User.isUserExists(payload.email);

  if (!(await user)) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Checking if the user already deleted or not
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Checking if the user suspended or not
  const isUserSuspended = user?.isSuspended;
  if (isUserSuspended) {
    throw new AppError(httpStatus.FORBIDDEN, "You are suspended!");
  }

  // Checking if the password is correct or not
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not correct.");
  }

  // Create token and send to client/user

  const jwtPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || [],
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
    },
  };
};

const refreshToken = async (token: string) => {
  // Checking if there is any token sent from the client or not.
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to proceed!"
    );
  }

  // Checking if the token is valid or not.
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  const user = await User.isUserExists(email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Checking if the user already deleted or not
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Have to check if the user is suspended or not

  const jwtPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || [],
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.isUserExists(email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const jwtPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || [],
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetLink = `${config.reset_password_ui_url}/reset-password?email=${user?.email}&token=${resetToken}`;

  await sendEmail(user?.email, resetLink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.isUserExists(payload?.email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if the token is valid or not.
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload?.email !== decoded?.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
};

const changePassword = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  const user = await User.findById(userId).select("+password");

  // Checking if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if the current password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Current password is incorrect!"
    );
  }

  // Hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );
  await User.findByIdAndUpdate(userId, {
    password: newHashedPassword,
  });
};

// Change user role (For admin)
const changeUserRole = async (payload: { userId: string; role: any }) => {
  const user = await User.findById(payload?.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await User.findByIdAndUpdate(
    payload?.userId,
    { role: payload?.role },
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
};

export const AuthServices = {
  signup,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  changeUserRole,
};
