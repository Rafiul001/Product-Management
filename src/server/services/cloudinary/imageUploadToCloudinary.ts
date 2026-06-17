import cloudinaryV2 from "./cloudinary.js";

export const uploadImage = (buffer: Buffer, folder?: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream(
      { ...(folder && { folder }), resource_type: "image" },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });

// Extracts the public_id from a Cloudinary secure_url so it can be deleted.
// e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg → folder/name
const extractPublicId = (url: string): string =>
  url.match(/\/upload\/v\d+\/(.+)\.[^.]+$/)?.[1] ?? "";

export const deleteImage = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (publicId) await cloudinaryV2.uploader.destroy(publicId);
};
