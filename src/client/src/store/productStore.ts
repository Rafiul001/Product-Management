import { toast } from "@heroui/react";
import type { TProductDocument } from "@shared/models/Product";
import type {
  TCreateProductValidationSchema,
  TUpdateProductValidationSchema,
} from "@shared/validators/product.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";
import type { TProductQueryParams } from "../api/productApi";
import {
  createProductApi,
  deleteProductByIdApi,
  getAllProductsAdminApi,
  getAllProductsApi,
  getProductByIdApi,
  updateProductByIdApi,
} from "../api/productApi";

type TProductPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TProductStore = {
  products: TProductDocument[];
  productsPagination: TProductPagination;
  adminProducts: TProductDocument[];
  adminProductsPagination: TProductPagination;
  selectedProduct: TProductDocument | null;

  getAllProducts: (params?: TProductQueryParams) => Promise<void>;
  getAllProductsAdmin: (params?: TProductQueryParams) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  createProduct: (formData: TCreateProductValidationSchema) => Promise<void>;
  updateProductById: (
    id: string,
    formData: TUpdateProductValidationSchema,
  ) => Promise<void>;
  deleteProductById: (id: string) => Promise<void>;
};

export const useProductStore = create<TProductStore>((set, get) => ({
  products: [],
  productsPagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
  adminProducts: [],
  adminProductsPagination: { total: 0, page: 1, limit: 8, totalPages: 0 },
  selectedProduct: null,

  getAllProducts: async (params) => {
    try {
      const response = await getAllProductsApi(params);
      const { products, total, page, limit, totalPages } = response.data.data;
      set({ products, productsPagination: { total, page, limit, totalPages } });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  getAllProductsAdmin: async (params) => {
    try {
      const response = await getAllProductsAdminApi(params);
      const { products, total, page, limit, totalPages } = response.data.data;
      set({
        adminProducts: products,
        adminProductsPagination: { total, page, limit, totalPages },
      });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  getProductById: async (id) => {
    try {
      const response = await getProductByIdApi(id);
      set({
        selectedProduct: response.data.data,
      });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  createProduct: async (formData) => {
    try {
      const newFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined) return;
        if (typeof value === "number") newFormData.set(key, value.toString());
        else newFormData.set(key, value as string | Blob);
      });
      await createProductApi(newFormData);
      await get().getAllProductsAdmin();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  updateProductById: async (id, formData) => {
    try {
      await updateProductByIdApi(id, formData);
      await get().getAllProductsAdmin();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  deleteProductById: async (id) => {
    try {
      await deleteProductByIdApi(id);
      await get().getAllProductsAdmin();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
