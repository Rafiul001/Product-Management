import type { ValidatedRequest } from "@server/middleware/validator.js";
import { NewArrivalModel } from "@shared/models/NewArrival.js";
import { OfferModel } from "@shared/models/Offer.js";
import { ProductModel } from "@shared/models/Product.js";
import { ReviewModel } from "@shared/models/Review.js";
import { conflict, created, notFound, ok } from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import { getBestOfferedPrice } from "@shared/utils/offerPrice.js";
import type {
  TAddNewArrivalValidationSchema,
  TRemoveNewArrivalParamsValidationSchema,
} from "@shared/validators/newArrival.validator.js";
import { Types } from "mongoose";

async function fetchActiveOffers() {
  const now = new Date();
  return OfferModel.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
}

export const getAllNewArrivalsController = asyncController(
  async (_req, res) => {
    const newArrivals = await NewArrivalModel.find({})
      .populate({
        path: "product",
        populate: { path: "subCategory", select: "_id subCategoryName status" },
      })
      .lean();

    const activeProducts = newArrivals
      .filter((na) => na.product != null && (na.product as any).quantity > 0)
      .map((na) => na.product as any);

    if (activeProducts.length === 0) {
      return ok(res, "Successfully fetched new arrivals", []);
    }

    const productObjectIds = activeProducts.map((p: any) =>
      typeof p._id === "string" ? new Types.ObjectId(p._id) : p._id,
    );

    const [activeOffers, reviewStats] = await Promise.all([
      fetchActiveOffers(),
      ReviewModel.aggregate([
        { $match: { product: { $in: productObjectIds } } },
        {
          $group: {
            _id: "$product",
            rating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const reviewMap = new Map<string, { rating: number; reviewCount: number }>(
      reviewStats.map((s: any) => [
        s._id.toString(),
        { rating: s.rating, reviewCount: s.reviewCount },
      ]),
    );

    const products = activeProducts.map((p: any) => {
      const id = p._id?.toString?.() ?? p._id;
      const offeredPrice = getBestOfferedPrice(
        p.price,
        typeof p._id === "string" ? new Types.ObjectId(p._id) : p._id,
        activeOffers,
      );
      const reviewData = reviewMap.get(id);
      return {
        ...p,
        ...(reviewData ?? {}),
        ...(offeredPrice !== undefined ? { offeredPrice } : {}),
      };
    });

    return ok(res, "Successfully fetched new arrivals", products);
  },
);

export const addNewArrivalController = asyncController<
  ValidatedRequest<{ body: TAddNewArrivalValidationSchema }>
>(async (req, res) => {
  const { productId } = req.validatedBody;

  const product = await ProductModel.findById(productId);
  if (!product) return notFound(res, "Product not found");

  const existing = await NewArrivalModel.findOne({ product: productId });
  if (existing) return conflict(res, "Product is already a new arrival");

  await new NewArrivalModel({ product: productId }).save();
  return created(res, "Product added to new arrivals");
});

export const removeNewArrivalController = asyncController<
  ValidatedRequest<{ params: TRemoveNewArrivalParamsValidationSchema }>
>(async (req, res) => {
  const { productId } = req.params;

  const result = await NewArrivalModel.findOneAndDelete({ product: productId });
  if (!result) return notFound(res, "New arrival entry not found");

  return ok(res, "Product removed from new arrivals");
});
