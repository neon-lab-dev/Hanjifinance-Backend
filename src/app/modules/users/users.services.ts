/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../auth/auth.model';

const getAllUser = async () => {
  const result = await User.find();
  return result;
};


const getMe = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};

const getMyOrders = async (userId: string) => {
  const user = await User.findById(userId).populate('orders');
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};


// const updateProfile = async (id: string, payload: Partial<TUser>, profilePic: any) => {
//   let profilePicUrl: string | undefined;

//   if (profilePic) {
//     const imageName = `${id}-profile-${Date.now()}`;
//     const path = profilePic.path;

//     const { secure_url } = await sendImageToCloudinary(imageName, path);
//     profilePicUrl = secure_url;
//   }

//   if (profilePicUrl) {
//     payload.profilePicture = profilePicUrl;
//   }

//   const result = await User.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };



const changeUserRoleToAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = 'admin';
  await user.save();
  return user;
};

const changeUserRoleToUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = 'user';
  await user.save();
  return user;
};

const suspendUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.isSuspended = true;
  await user.save();
  return user;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getSingleUserById = async (userId:string) => {
  const result = await User.findById(userId);
  return result;
};

const followUser = async (currentUserId: string, userId: string) => {
  const user = await User.findByIdAndUpdate(
    currentUserId,
    { $addToSet: { following: userId } },
    { new: true }
  );

  const targetUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { followers: currentUserId } },
    { new: true }
  );

  return { user, targetUser };
};


const unfollowUser = async (currentUserId: string, userId: string) => {
  const user = await User.findByIdAndUpdate(
    currentUserId,
    { $pull: { following: { userId: userId } } },
    { new: true }
  );

  const targetUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { followers: { userId: currentUserId } } },
    { new: true }
  );

  return { user, targetUser };
};


export const UserServices = {
  getAllUser,
  getMe,
  deleteUser,
  changeUserRoleToAdmin,
  changeUserRoleToUser,
  suspendUser,
  getSingleUserById,
  followUser,
  unfollowUser,
  getMyOrders,
};
