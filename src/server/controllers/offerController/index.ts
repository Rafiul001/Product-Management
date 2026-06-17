import type { ValidatedRequest } from "@server/middleware/validator.js";
import { OfferModel } from "@shared/models/Offer.js";
import { ProductModel } from "@shared/models/Product.js";
import {
  badRequest,
  created,
  notFound,
  ok,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type {
  TCreateOfferValidationSchema,
  TOfferParamsValidationSchema,
  TUpdateOfferValidationSchema,
} from "@shared/validators/offer.validator.js";

async function findConflictingOffer(
  productIds: string[],
  excludeOfferId?: string,
) {
  if (!productIds.length) return null;
  const query: Record<string, unknown> = {
    applicableProducts: { $in: productIds },
  };
  if (excludeOfferId) query._id = { $ne: excludeOfferId };
  return OfferModel.findOne(query).select("title").lean();
}

export const getAllOffersController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const offers = await OfferModel.find({}).sort({ createdAt: -1 });
    return ok(res, "Successfully fetched all offers", offers);
  },
);

export const getActiveOffersController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const now = new Date();
    const offers = await OfferModel.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });
    return ok(res, "Successfully fetched active offers", offers);
  },
);

export const getOfferByIdController = asyncController<
  ValidatedRequest<{ params: TOfferParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const offer = await OfferModel.findById(id);
  if (!offer) return notFound(res, "Offer not found");
  return ok(res, "Successfully fetched the offer", offer);
});

export const createOfferController = asyncController<
  ValidatedRequest<{ body: TCreateOfferValidationSchema }>
>(async (req, res) => {
  const {
    title,
    description,
    badge,
    discountType,
    discountValue,
    applicableProducts,
    startDate,
    endDate,
    isActive,
  } = req.validatedBody;

  const productIds = applicableProducts ?? [];

  if (productIds.length > 0) {
    const missing = await ProductModel.countDocuments({
      _id: { $nin: productIds },
    });
    const conflict = await findConflictingOffer(productIds);
    if (conflict) {
      return badRequest(
        res,
        `One or more products are already assigned to offer "${conflict.title}"`,
      );
    }
    void missing;
  }

  const newOffer = new OfferModel({
    title,
    description,
    badge,
    discountType,
    discountValue,
    applicableProducts: productIds,
    startDate,
    endDate,
    isActive: isActive ?? true,
  });

  await newOffer.save();
  return created(res, "Offer created successfully");
});

export const updateOfferController = asyncController<
  ValidatedRequest<{
    body: TUpdateOfferValidationSchema;
    params: TOfferParamsValidationSchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const { applicableProducts, ...rest } = req.validatedBody;

  const existing = await OfferModel.findById(id);
  if (!existing) return notFound(res, "Offer not found");

  if (applicableProducts !== undefined && applicableProducts.length > 0) {
    const conflict = await findConflictingOffer(applicableProducts, id);
    if (conflict) {
      return badRequest(
        res,
        `One or more products are already assigned to offer "${conflict.title}"`,
      );
    }
  }

  const updateData =
    applicableProducts !== undefined ? { ...rest, applicableProducts } : rest;

  const result = await OfferModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: "after" },
  );

  if (!result) return badRequest(res, "Something went wrong");
  return ok(res, "Offer updated successfully");
});

export const deleteOfferController = asyncController<
  ValidatedRequest<{ params: TOfferParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const offer = await OfferModel.findById(id);
  if (!offer) return notFound(res, "Offer not found");

  await OfferModel.findByIdAndDelete(id);
  return ok(res, "Offer deleted successfully");
});
