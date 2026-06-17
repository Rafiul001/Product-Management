import type { ValidatedRequest } from "@server/middleware/validator.js";
import { CategoryModel } from "@shared/models/Category.js";
import { SubCategoryModel } from "@shared/models/SubCategory.js";
import {
  badRequest,
  conflict,
  created,
  ok,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import type {
  TCreateCategoryValidationSchema,
  TDeleteCategoryParamsValidationSchema,
  TUpdateCategoryParamsValidationSchema,
  TUpdateCategoryValidationSchema,
} from "@shared/validators/category.validator.js";

export const getAllCategoriesController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const categories = await CategoryModel.find({});
    return ok(res, "Successfully fetched categories", categories);
  },
);

export const createCategoryController = asyncController<
  ValidatedRequest<{ body: TCreateCategoryValidationSchema }>
>(async (req, res) => {
  const { categoryName } = req.validatedBody;
  const newCategory = new CategoryModel({
    categoryName,
  });

  await newCategory.save();
  return created(res, "Category created");
});

export const updateCategoryController = asyncController<
  ValidatedRequest<{
    params: TUpdateCategoryParamsValidationSchema;
    body: TUpdateCategoryValidationSchema;
  }>
>(async (req, res) => {
  const { id } = req.params;

  const { categoryName, status } = req.validatedBody;

  const result = await CategoryModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        categoryName: categoryName,
        status: status,
      },
    },
    { returnDocument: "after" },
  );

  if (!result) return badRequest(res, "Something went wrong");
  return ok(res, "Category updated");
});

export const deleteCategoryController = asyncController<
  ValidatedRequest<{ params: TDeleteCategoryParamsValidationSchema }>
>(async (req, res) => {
  const { id } = req.params;

  const subCategoryCount = await SubCategoryModel.countDocuments({
    category: id,
  });

  if (subCategoryCount > 0)
    return conflict(res, "Cannot delete category with existing subcategory");

  const result = await CategoryModel.deleteOne({ _id: id });
  if (!result.acknowledged) return badRequest(res, "Can't delete now");

  return ok(res, "Category deleted");
});
