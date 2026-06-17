import { toast } from "@heroui/react";
import type { TCategoryDocument } from "@shared/models/Category";
import type {
  TCreateCategoryValidationSchema,
  TUpdateCategoryValidationSchema,
} from "@shared/validators/category.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../api/categoryApi";

type TCategoryStore = {
  categories: TCategoryDocument[];

  getAllCategories: () => Promise<void>;
  createCategory: (formData: TCreateCategoryValidationSchema) => Promise<void>;
  updateCategory: (
    id: string,
    formData: TUpdateCategoryValidationSchema,
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<TCategoryStore>((set, get) => ({
  categories: [],

  getAllCategories: async () => {
    try {
      const response = await getCategoriesApi();
      if (response.status < 400)
        set({
          categories: response.data.data,
        });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  createCategory: async (formData: TCreateCategoryValidationSchema) => {
    try {
      const response = await createCategoryApi(formData);
      if (response.status < 400) await get().getAllCategories();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  updateCategory: async (id, formData) => {
    try {
      const response = await updateCategoryApi(id, formData);
      if (response.status < 400) await get().getAllCategories();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await deleteCategoryApi(id);
      if (response.status < 400) await get().getAllCategories();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
