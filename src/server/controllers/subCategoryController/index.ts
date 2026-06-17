import type { ValidatedRequest } from "@server/middleware/validator.js";
import { DB } from "@shared/constants/DB.js";
import { ProductModel } from "@shared/models/Product.js";
import { SubCategoryModel } from "@shared/models/SubCategory.js";
import {
  badRequest,
  conflict,
  created,
  ok,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type {
  TCreateSubCategoryValidationSchema,
  TDeleteSubCategoryParamsValidationSchema,
  TUpdateSubCategoryParamsValidationSchema,
  TUpdateSubCategoryValidationSchema,
} from "@shared/validators/subCategory.validator.js";

export const getAllSubCategoryController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const subCategories = await SubCategoryModel.find().populate(
      DB.CATEGORY,
      "_id categoryName status",
    );
    return ok(res, "Successfully get all sub categories", subCategories);
  },
);

export const createSubCategoryController = asyncController<
  ValidatedRequest<{ body: TCreateSubCategoryValidationSchema }>
>(async (req, res) => {
  const { subCategoryName, category } = req.validatedBody;
  const newSubCategory = new SubCategoryModel({
    subCategoryName,
    category,
  });

  await newSubCategory.save();
  return created(res, "Sub category created successfully");
});

export const updateSubCategoryController = asyncController<
  ValidatedRequest<{
    body: TUpdateSubCategoryValidationSchema;
    params: TUpdateSubCategoryParamsValidationSchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const { subCategoryName, status, category } = req.validatedBody;

  const result = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        subCategoryName: subCategoryName,
        status: status,
        category: category,
      },
    },
    { returnDocument: "after" },
  );

  if (!result) return badRequest(res, "Sub Category update failed");

  return ok(res, "Sub Category updated");
});

export const deleteSubCategoryController = asyncController<
  ValidatedRequest<{ params: TDeleteSubCategoryParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;

  const productCount = await ProductModel.countDocuments({
    subCategory: id,
  });

  if (productCount > 0)
    return conflict(res, "Cannot delete sub category with existing products");

  const result = await SubCategoryModel.deleteOne({ _id: id });
  if (!result.acknowledged)
    return badRequest(res, "Sub Category delete failed");

  return ok(res, "Sub Category deleted");
});
