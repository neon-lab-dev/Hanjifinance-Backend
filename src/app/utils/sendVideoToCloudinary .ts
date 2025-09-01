import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const sendVideoToCloudinary = async (
  videoName: string,
  filePath: string
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: videoName,
      resource_type: "video",
      folder: "courses/videos",
    });

    fs.unlinkSync(filePath);

    return {
      secure_url: result.secure_url,
      duration: result.duration,
      format: result.format,
    };
  } catch (error) {
    throw new Error("Video upload failed: " + error);
  }
};
