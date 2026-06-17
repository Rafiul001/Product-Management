import { toast } from "@heroui/react";
import type { TBannerDocument } from "@shared/models/Banner";
import type {
  TCreateBannerValidationSchema,
  TUpdateBannerValidationSchema,
} from "@shared/validators/banner.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  createBannerApi,
  deleteBannerByIdApi,
  getAllBannersApi,
  updateBannerByIdApi,
} from "../api/bannerApi";

type TBannerStore = {
  banners: TBannerDocument[];

  getAllBanners: () => Promise<void>;
  createBanner: (formData: TCreateBannerValidationSchema) => Promise<void>;
  updateBannerById: (
    id: string,
    formData: TUpdateBannerValidationSchema,
  ) => Promise<void>;
  deleteBannerById: (id: string) => Promise<void>;
};

export const useBannerStore = create<TBannerStore>((set, get) => ({
  banners: [],

  getAllBanners: async () => {
    try {
      const response = await getAllBannersApi();
      if (response.status < 400) set({ banners: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  createBanner: async (formData) => {
    try {
      const newFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined) return;
        if (value instanceof File) newFormData.set(key, value);
        else newFormData.set(key, String(value));
      });
      await createBannerApi(newFormData);
      await get().getAllBanners();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  updateBannerById: async (id, formData) => {
    try {
      await updateBannerByIdApi(id, formData);
      await get().getAllBanners();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  deleteBannerById: async (id) => {
    try {
      await deleteBannerByIdApi(id);
      await get().getAllBanners();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
