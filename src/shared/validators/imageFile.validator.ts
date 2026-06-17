import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Covers both browser File and multer's Express.Multer.File
type AnyFile = File | { mimetype: string; size: number };

const getMimeType = (file: AnyFile): string =>
  file instanceof File ? file.type : file.mimetype;

const getSize = (file: AnyFile): number => file.size;

export const imageFile = (options?: {
  maxSize?: number;
  acceptedTypes?: string[];
}) => {
  const maxSize = options?.maxSize ?? MAX_FILE_SIZE;
  const acceptedTypes = options?.acceptedTypes ?? ACCEPTED_IMAGE_TYPES;

  return z
    .custom<AnyFile>(
      (val) =>
        val instanceof File ||
        (typeof val === "object" &&
          val !== null &&
          "mimetype" in val &&
          "size" in val),
      { message: "Expected a file" },
    )
    .refine(
      (file) => getSize(file) <= maxSize,
      `File size should be less than ${maxSize / (1024 * 1024)} MB`,
    )
    .refine(
      (file) => acceptedTypes.includes(getMimeType(file)),
      `File type should be one of: ${acceptedTypes.join(", ")}`,
    );
};
