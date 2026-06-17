import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  addNewArrivalApi,
  getAllNewArrivalsApi,
  removeNewArrivalApi,
} from "../api/newArrivalApi";
import type { PopulatedProduct } from "../components/organisms/user/ProductItem";

type TNewArrivalStore = {
  newArrivals: PopulatedProduct[];
  newArrivalProductIds: Set<string>;

  getAllNewArrivals: () => Promise<void>;
  addNewArrival: (productId: string) => Promise<void>;
  removeNewArrival: (productId: string) => Promise<void>;
};

export const useNewArrivalStore = create<TNewArrivalStore>((set, get) => ({
  newArrivals: [],
  newArrivalProductIds: new Set(),

  getAllNewArrivals: async () => {
    try {
      const res = await getAllNewArrivalsApi();
      const products: PopulatedProduct[] = res.data.data;
      set({
        newArrivals: products,
        newArrivalProductIds: new Set(products.map((p) => p._id)),
      });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  addNewArrival: async (productId) => {
    try {
      await addNewArrivalApi(productId);
      await get().getAllNewArrivals();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  removeNewArrival: async (productId) => {
    try {
      await removeNewArrivalApi(productId);
      await get().getAllNewArrivals();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
