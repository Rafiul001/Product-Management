import type { ValidatedRequest } from "@server/middleware/validator.js";
import {
  deleteImage,
  uploadImage,
} from "@server/services/cloudinary/imageUploadToCloudinary.js";
import { Banner } from "@shared/models/Banner.js";
import { created, notFound, ok } from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type {
  TCreateBannerValidationSchema,
  TDeleteBannerParamsValidationSchema,
  TGetBannerParamsValidationSchema,
  TUpdateBannerParamsValidationSchema,
  TUpdateBannerValidationSchema,
} from "@shared/validators/banner.validator.js";

export const getAllBannersController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const allBanners = await Banner.find({});
    return ok(res, "Successfully fetched all banners", allBanners);
  },
);

export const getBannerByIdController = asyncController<
  ValidatedRequest<{ params: TGetBannerParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) return notFound(res, "Banner not found");
  return ok(res, "Successfully fetched the banner", banner);
});

export const createBannerController = asyncController<
  ValidatedRequest<{ body: TCreateBannerValidationSchema }>
>(async (req, res) => {
  const { title, description, link } = req.validatedBody;

  const imageUrl = req.validatedFile
    ? await uploadImage(req.validatedFile.buffer)
    : undefined;

  const newBanner = new Banner({ title, description, link, image: imageUrl });
  await newBanner.save();
  return created(res, "Banner created successfully");
});

export const updateBannerController = asyncController<
  ValidatedRequest<{
    body: TUpdateBannerValidationSchema;
    params: TUpdateBannerParamsValidationSchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const { title, description, link } = req.validatedBody;

  const existingBanner = await Banner.findById(id);
  if (!existingBanner) return notFound(res, "Banner not found");

  const updateData: Record<string, unknown> = { title, description, link };

  if (req.validatedFile) {
    if (existingBanner.image) {
      await deleteImage(existingBanner.image).catch(console.error);
    }
    updateData.image = await uploadImage(req.validatedFile.buffer);
  }

  await Banner.findByIdAndUpdate(id, { $set: updateData });
  return ok(res, "Successfully updated the banner");
});

export const deleteBannerController = asyncController<
  ValidatedRequest<{ params: TDeleteBannerParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) return notFound(res, "Banner not found");

  if (banner.image) {
    await deleteImage(banner.image).catch(console.error);
  }
  await Banner.findByIdAndDelete(id);
  return ok(res, "Successfully deleted the banner");
});
