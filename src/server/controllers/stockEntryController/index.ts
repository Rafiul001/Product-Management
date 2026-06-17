import type { ValidatedRequest } from "@server/middleware/validator.js";
import {
  deleteImage,
  uploadImage,
} from "@server/services/cloudinary/imageUploadToCloudinary.js";
import { ProductModel } from "@shared/models/Product.js";
import { StockEntryModel } from "@shared/models/StockEntry.js";
import {
  badRequest,
  created,
  notFound,
  ok,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type {
  TCreateStockEntryValidationSchema,
  TDeleteStockEntryParamsValidationSchema,
  TGetStockEntryParamsValidationSchema,
} from "@shared/validators/stockEntry.validator.js";

export const getAllStockEntriesController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const allStockEntries = await StockEntryModel.find({})
      .populate("productList.product", "_id productName price productImage")
      .sort({ createdAt: -1 });
    return ok(res, "Successfully fetched all stock entries", allStockEntries);
  },
);

export const getStockEntryByIdController = asyncController<
  ValidatedRequest<{ params: TGetStockEntryParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const stockEntry = await StockEntryModel.findById(id).populate(
    "productList.product",
    "_id productName price productImage",
  );
  if (!stockEntry) return notFound(res, "Stock entry not found");
  return ok(res, "Successfully fetched the stock entry", stockEntry);
});

export const createStockEntryController = asyncController<
  ValidatedRequest<{ body: TCreateStockEntryValidationSchema }>
>(async (req, res) => {
  const { productList } = req.validatedBody;

  if (!req.validatedFile) {
    return res.status(400).json({ message: "Challan image is required" });
  }

  // Verify stock limits before creating the entry
  for (const item of productList) {
    const product = await ProductModel.findById(item.product);
    if (!product) {
      return notFound(res, `Product not found: ${item.product}`);
    }

    const stockLimit = product.stockLimit ?? 0;
    const currentQuantity = product.quantity ?? 0;
    const projectedQuantity = currentQuantity + Number(item.quantity);

    if (projectedQuantity > stockLimit) {
      return badRequest(
        res,
        `Adding ${item.quantity} unit(s) of "${product.productName}" would exceed its stock limit of ${stockLimit} (current stock: ${currentQuantity}, available: ${stockLimit - currentQuantity})`,
      );
    }
  }

  const challanImageUrl = await uploadImage(req.validatedFile.buffer);

  const newStockEntry = new StockEntryModel({
    productList,
    challanImage: challanImageUrl,
    totalCost: 0,
  });

  await newStockEntry.save();

  // Increment product quantities after the entry is saved
  for (const item of productList) {
    await ProductModel.findByIdAndUpdate(item.product, {
      $inc: { quantity: item.quantity },
    });
  }

  return created(res, "Stock entry created successfully");
});

export const deleteStockEntryController = asyncController<
  ValidatedRequest<{ params: TDeleteStockEntryParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;
  const stockEntry = await StockEntryModel.findById(id);
  if (!stockEntry) return notFound(res, "Stock entry not found");

  // Reverse product quantity increments before deleting
  for (const item of stockEntry.productList) {
    await ProductModel.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    });
  }

  if (stockEntry.challanImage) {
    await deleteImage(stockEntry.challanImage).catch(console.error);
  }
  await StockEntryModel.findOneAndDelete({ _id: id });
  return ok(res, "Successfully deleted the stock entry");
});
