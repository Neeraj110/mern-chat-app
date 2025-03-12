import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.log("Cloudinary credentials are missing");
}

export const uploadOnCloudinary = async (localFilePath, options = {}) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      ...options,
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteOnCloudinary = async (url) => {
  try {
    if (!url) return null;

    const public_id = url.split("/").slice(7, 9).join("/").split(".")[0];
    let resource_type = "image";

    if (url.includes("/video/")) {
      resource_type = "video";
    } else if (url.includes("/raw/")) {
      resource_type = "raw";
    }

    return await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type,
    });
  } catch (error) {
    throw error;
  }
};
