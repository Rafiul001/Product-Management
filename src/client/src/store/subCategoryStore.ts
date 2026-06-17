import { toast } from "@heroui/react";
import type {
  TCreateSubCategoryValidationSchema,
  TUpdateSubCategoryValidationSchema,
} from "@shared/validators/subCategory.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  createSubCategoryApi,
  deleteSubCategoryApi,
  getSubCategoriesApi,
  updateSubCategoryApi,
} from "../api/subCategoryApi";
import type { ISubCategoryResponse } from "../types/subCategory.types";

type TSubCategoryStore = {
  subCategories: ISubCategoryResponse[];
  getAllSubCategories: () => Promise<void>;
  createSubCategory: (
    formData: TCreateSubCategoryValidationSchema,
  ) => Promise<void>;
  updateSubCategory: (
    id: string,
    formData: TUpdateSubCategoryValidationSchema,
  ) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
};

export const useSubCategoryStore = create<TSubCategoryStore>((set, get) => ({
  subCategories: [],

  getAllSubCategories: async () => {
    try {
      const response = await getSubCategoriesApi();
      if (response.status < 400)
        set({
          subCategories: response.data.data,
        });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  createSubCategory: async (formData) => {
    try {
      const response = await createSubCategoryApi(formData);
      if (response.status < 400) await get().getAllSubCategories();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  updateSubCategory: async (id, formData) => {
    try {
      const response = await updateSubCategoryApi(id, formData);
      if (response.status < 400) await get().getAllSubCategories();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  deleteSubCategory: async (id) => {
    try {
      const response = await deleteSubCategoryApi(id);
      if (response.status < 400) await get().getAllSubCategories();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
