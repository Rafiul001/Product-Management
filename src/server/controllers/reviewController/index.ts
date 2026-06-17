import type { ValidatedRequest } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import { ReviewModel } from "@shared/models/Review.js";
import {
  badRequest,
  conflict,
  created,
  forbidden,
  notFound,
  ok,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type {
  TCreateReviewValidationSchema,
  TGetReviewsByProductParamsValidationSchema,
  TReviewParamsValidationSchema,
  TUpdateReviewValidationSchema,
} from "@shared/validators/review.validator.js";

export const getReviewsByProductController = asyncController<
  ValidatedRequest<{ params: TGetReviewsByProductParamsValidationSchema }>
>(async (req, res) => {
  const { productId } = req.params;
  const reviews = await ReviewModel.find({ product: productId }).populate(
    "user",
    "_id userName",
  );
  return ok(res, "Successfully fetched reviews", reviews);
});

export const createReviewController = asyncController<
  ValidatedRequest<{ body: TCreateReviewValidationSchema }>
>(async (req, res) => {
  const { product, rating, comment, image } = req.validatedBody;
  const userId = req.userId!;

  const existing = await ReviewModel.findOne({ product, user: userId });
  if (existing) return conflict(res, "You have already reviewed this product");

  const newReview = new ReviewModel({
    product,
    user: userId,
    rating,
    comment,
    image: image ?? [],
  });

  await newReview.save();
  return created(res, "Review created successfully");
});

export const updateReviewController = asyncController<
  ValidatedRequest<{
    params: TReviewParamsValidationSchema;
    body: TUpdateReviewValidationSchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId!;

  const review = await ReviewModel.findById(id);
  if (!review) return notFound(res, "Review not found");

  if (review.user.toString() !== userId) {
    return forbidden(res, "You can only update your own reviews");
  }

  const { rating, comment, image } = req.validatedBody;

  const result = await ReviewModel.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
        ...(image !== undefined && { image }),
      },
    },
    { returnDocument: "after" },
  );

  if (!result) return badRequest(res, "Something went wrong");
  return ok(res, "Review updated successfully");
});

export const deleteReviewController = asyncController<
  ValidatedRequest<{ params: TReviewParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId!;
  const role = req.role;

  const review = await ReviewModel.findById(id);
  if (!review) return notFound(res, "Review not found");

  if (role !== ROLES.ADMIN && review.user.toString() !== userId) {
    return forbidden(res, "You can only delete your own reviews");
  }

  await ReviewModel.findByIdAndDelete(id);
  return ok(res, "Review deleted successfully");
});
