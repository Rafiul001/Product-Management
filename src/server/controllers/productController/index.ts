import type { ValidatedRequest } from "@server/middleware/validator.js";
import {
  deleteImage,
  uploadImage,
} from "@server/services/cloudinary/imageUploadToCloudinary.js";
import { CategoryModel } from "@shared/models/Category.js";
import { NewArrivalModel } from "@shared/models/NewArrival.js";
import { OfferModel } from "@shared/models/Offer.js";
import { ProductModel, type TProductDocument } from "@shared/models/Product.js";
import { ReviewModel } from "@shared/models/Review.js";
import { SubCategoryModel } from "@shared/models/SubCategory.js";
import {
  badRequest,
  created,
  notFound,
  ok,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import { getBestOfferedPrice } from "@shared/utils/offerPrice.js";
import type {
  TCreateProductValidationSchema,
  TDeleteProductParamsValidationSchema,
  TGetProductParamsValidationSchema,
  TUpdateProductParamsValidationSchema,
  TUpdateProductValidationSchema,
} from "@shared/validators/product.validator.js";
import type { PipelineStage, UpdateQuery } from "mongoose";
import { Types } from "mongoose";

type TOfferFilter = {
  productIds: Types.ObjectId[];
  appliesToAll: boolean;
};

function buildProductsPipeline(
  query: Record<string, string | undefined>,
  requireActive: boolean,
  page: number,
  limit: number,
  offerFilter?: TOfferFilter,
): PipelineStage[] {
  const {
    search,
    categories,
    subCategories,
    minPrice: minPriceStr,
    maxPrice: maxPriceStr,
    sortBy,
    sortOrder,
    inStock,
    productStatus,
  } = query;

  const categoryIds = categories ? categories.split(",").filter(Boolean) : [];
  const subCategoryIds = subCategories
    ? subCategories.split(",").filter(Boolean)
    : [];
  const minPrice = minPriceStr !== undefined ? Number(minPriceStr) : undefined;
  const maxPrice = maxPriceStr !== undefined ? Number(maxPriceStr) : undefined;

  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $lookup: {
      from: SubCategoryModel.collection.name,
      localField: "subCategory",
      foreignField: "_id",
      as: "_subCat",
      pipeline: [
        {
          $lookup: {
            from: CategoryModel.collection.name,
            localField: "category",
            foreignField: "_id",
            as: "_cat",
          },
        },
        { $unwind: { path: "$_cat", preserveNullAndEmptyArrays: true } },
      ],
    },
  });
  pipeline.push({
    $unwind: { path: "$_subCat", preserveNullAndEmptyArrays: true },
  });

  const andConditions: Record<string, unknown>[] = [];

  if (requireActive) {
    andConditions.push(
      { productStatus: true },
      { "_subCat.status": true },
      { "_subCat._cat.status": true },
    );
  }

  if (categoryIds.length > 0 || subCategoryIds.length > 0) {
    const orConds: Record<string, unknown>[] = [];
    if (categoryIds.length > 0) {
      orConds.push({
        "_subCat._cat._id": {
          $in: categoryIds.map((id) => new Types.ObjectId(id)),
        },
      });
    }
    if (subCategoryIds.length > 0) {
      orConds.push({
        subCategory: {
          $in: subCategoryIds.map((id) => new Types.ObjectId(id)),
        },
      });
    }
    if (orConds.length === 1) {
      andConditions.push(orConds[0]!);
    } else {
      andConditions.push({ $or: orConds });
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceCond: Record<string, number> = {};
    if (minPrice !== undefined) priceCond.$gte = minPrice;
    if (maxPrice !== undefined) priceCond.$lte = maxPrice;
    andConditions.push({ price: priceCond });
  }

  if (inStock === "true") {
    andConditions.push({ quantity: { $gt: 0 } });
  }

  if (!requireActive && productStatus !== undefined) {
    andConditions.push({ productStatus: productStatus === "true" });
  }

  if (
    offerFilter &&
    !offerFilter.appliesToAll &&
    offerFilter.productIds.length > 0
  ) {
    andConditions.push({ _id: { $in: offerFilter.productIds } });
  }

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    andConditions.push({
      $or: [
        { productName: { $regex: escaped, $options: "i" } },
        { "_subCat.subCategoryName": { $regex: escaped, $options: "i" } },
        { "_subCat._cat.categoryName": { $regex: escaped, $options: "i" } },
      ],
    });
  }

  if (andConditions.length === 1) {
    pipeline.push({ $match: andConditions[0]! as Record<string, any> });
  } else if (andConditions.length > 1) {
    pipeline.push({ $match: { $and: andConditions } as Record<string, any> });
  }

  const dir = sortOrder === "desc" ? -1 : 1;
  const sortField =
    sortBy === "price"
      ? "price"
      : sortBy === "category"
        ? "_subCat._cat.categoryName"
        : "productName";
  pipeline.push({ $sort: { [sortField]: dir } });

  pipeline.push({
    $lookup: {
      from: ReviewModel.collection.name,
      let: { productId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ],
      as: "_reviewStats",
    },
  } as PipelineStage);

  const projectStage = {
    $project: {
      productName: 1,
      productImage: 1,
      description: 1,
      quantity: 1,
      price: 1,
      productStatus: 1,
      stockLimit: 1,
      createdAt: 1,
      updatedAt: 1,
      subCategory: {
        _id: "$_subCat._id",
        subCategoryName: "$_subCat.subCategoryName",
        status: "$_subCat.status",
      },
      rating: { $arrayElemAt: ["$_reviewStats.avg", 0] },
      reviewCount: { $arrayElemAt: ["$_reviewStats.count", 0] },
    },
  };

  pipeline.push({
    $facet: {
      products: [
        { $skip: (page - 1) * limit },
        { $limit: limit },
        projectStage,
      ],
      total: [{ $count: "count" }],
    },
  } as PipelineStage);

  return pipeline;
}

async function fetchActiveOffers() {
  const now = new Date();
  return OfferModel.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
}

export const getAllProductsController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));

    const now = new Date();
    let offerFilter: TOfferFilter | undefined;
    if (query.offerId) {
      const offer = await OfferModel.findOne({
        _id: query.offerId,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      });
      if (offer) {
        offerFilter = {
          productIds: offer.applicableProducts as Types.ObjectId[],
          appliesToAll: offer.applicableProducts.length === 0,
        };
      }
    }

    const pipeline = buildProductsPipeline(
      query,
      true,
      page,
      limit,
      offerFilter,
    );
    const [result] = await ProductModel.aggregate(pipeline);

    const activeOffers = await fetchActiveOffers();

    const products = ((result?.products ?? []) as any[]).map((p) => {
      const offeredPrice = getBestOfferedPrice(p.price, p._id, activeOffers);
      return offeredPrice !== undefined ? { ...p, offeredPrice } : p;
    });

    const total = result?.total[0]?.count ?? 0;
    return ok(res, "Successfully fetched all products", {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  },
);

export const getAllProductsAdminController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const query = req.query as Record<string, string | undefined>;
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 8));

    let newArrivalFilter: TOfferFilter | undefined;
    if (query.newArrivalOnly === "true") {
      const entries = await NewArrivalModel.find({}).lean();
      newArrivalFilter = {
        productIds: entries.map((e: any) => e.product),
        appliesToAll: false,
      };
    }

    const pipeline = buildProductsPipeline(
      query,
      false,
      page,
      limit,
      newArrivalFilter,
    );
    const [result] = await ProductModel.aggregate(pipeline);

    const total = result?.total[0]?.count ?? 0;
    return ok(res, "Successfully fetched all products", {
      products: (result?.products ?? []) as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  },
);

export const getLatestProductsController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const latestProducts = await ProductModel.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("subCategory", "_id subCategoryName status")
      .lean();

    const [activeOffers, reviewStats] = await Promise.all([
      fetchActiveOffers(),
      ReviewModel.aggregate([
        {
          $match: {
            product: {
              $in: latestProducts.map((p) => p._id as Types.ObjectId),
            },
          },
        },
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

    const products = latestProducts.map((p) => {
      const offeredPrice = getBestOfferedPrice(
        p.price,
        p._id as Types.ObjectId,
        activeOffers,
      );
      const reviewData = reviewMap.get((p._id as Types.ObjectId).toString());
      return {
        ...p,
        ...(reviewData ?? {}),
        ...(offeredPrice !== undefined ? { offeredPrice } : {}),
      };
    });

    return ok(res, "Successfully fetched latest products", products);
  },
);

export const getProductByIdController = asyncController<
  ValidatedRequest<{ params: TGetProductParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findOne({ _id: id })
    .populate("subCategory", "_id subCategoryName status")
    .lean();

  if (!product) return ok(res, "Successfully fetched the product", product);

  const activeOffers = await fetchActiveOffers();
  const offeredPrice = getBestOfferedPrice(
    product.price,
    product._id as Types.ObjectId,
    activeOffers,
  );

  return ok(
    res,
    "Successfully fetched the product",
    offeredPrice !== undefined ? { ...product, offeredPrice } : product,
  );
});

export const createProductController = asyncController<
  ValidatedRequest<{ body: TCreateProductValidationSchema }>
>(async (req, res) => {
  const { productName, subCategory, price, description, stockLimit } =
    req.validatedBody;

  const imageUrl = req.validatedFile
    ? await uploadImage(req.validatedFile.buffer)
    : undefined;

  const newProduct = new ProductModel({
    productName,
    subCategory,
    price,
    description,
    stockLimit,
    productImage: imageUrl,
  });

  await newProduct.save();
  return created(res, "Product created successfully");
});

export const updateProductController = asyncController<
  ValidatedRequest<{
    body: TUpdateProductValidationSchema;
    params: TUpdateProductParamsValidationSchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    subCategory,
    price,
    description,
    stockLimit,
    productStatus,
  } = req.validatedBody;

  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) return notFound(res, "Product not found");

  if (stockLimit !== undefined && stockLimit < existingProduct.quantity) {
    return badRequest(
      res,
      `Stock limit cannot be less than the current stock quantity (${existingProduct.quantity})`,
    );
  }

  const updatedQuery: UpdateQuery<TProductDocument> = {
    $set: {
      productName,
      subCategory,
      price,
      stockLimit,
      productStatus,
      description,
    },
  };

  if (req.validatedFile) {
    if (existingProduct.productImage) {
      await deleteImage(existingProduct.productImage).catch(console.error);
    }
    const imageUrl = await uploadImage(req.validatedFile.buffer);
    updatedQuery.$set = { ...updatedQuery.$set, productImage: imageUrl };
  }

  await ProductModel.findByIdAndUpdate({ _id: id }, updatedQuery);
  return ok(res, "Successfully updated the product");
});

export const deleteProductController = asyncController<
  ValidatedRequest<{ params: TDeleteProductParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  if (!product) return notFound(res, "Product not found");

  if (product.productImage) {
    await deleteImage(product.productImage).catch(console.error);
  }
  await Promise.all([
    ProductModel.findOneAndDelete({ _id: id }),
    ReviewModel.deleteMany({ product: id }),
  ]);
  return ok(res, "Successfully deleted the product");
});
