import { v2 as cloudinary } from "cloudinary";
import env from "./env";


cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `odoo-finals/${folderName}`,
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new Error(error?.message || "Failed to upload image to Cloudinary"),
          );
        }
        resolve(result.secure_url);
      },
    );

    // End the stream with the buffer data
    uploadStream.end(fileBuffer);
  });
};

/**
 * Extracts the public_id from a secure Cloudinary URL.
 * Required to delete images when a product is permanently removed.
 */
export const extractPublicId = (secureUrl) => {
  const splitUrl = secureUrl.split("/");
  const fileWithExtension = splitUrl.pop() || "";
  const folderPath = splitUrl.slice(splitUrl.indexOf("odoo-final")).join("/");
  const publicId = fileWithExtension.split(".")[0];

  return `${folderPath}/${publicId}`;
};

/**
 * Deletes an asset from Cloudinary.
 */
export const deleteFromCloudinary = async (secureUrl) => {
  try {
    const publicId = extractPublicId(secureUrl);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete asset: ${secureUrl}`, error);
  }
};

export default cloudinary;