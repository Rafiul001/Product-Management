import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  createStockEntryApi,
  deleteStockEntryByIdApi,
  getAllStockEntriesApi,
} from "../api/stockEntryApi";
import type { TStockEntryDocument } from "../types/stockEntry.types";
import type { TCreateStockEntryValidationSchema } from "@shared/validators/stockEntry.validator";

type TStockEntryStore = {
  stockEntries: TStockEntryDocument[];

  getAllStockEntries: () => Promise<void>;
  createStockEntry: (formData: TCreateStockEntryValidationSchema) => Promise<void>;
  deleteStockEntryById: (id: string) => Promise<void>;
};

export const useStockEntryStore = create<TStockEntryStore>((set, get) => ({
  stockEntries: [],

  getAllStockEntries: async () => {
    try {
      const response = await getAllStockEntriesApi();
      set({ stockEntries: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  createStockEntry: async (formData) => {
    try {
      const multipartFormData = new FormData();
      multipartFormData.append(
        "productList",
        JSON.stringify(formData.productList),
      );
      multipartFormData.append("challanImage", formData.challanImage as File);
      await createStockEntryApi(multipartFormData);
      await get().getAllStockEntries();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
      throw err;
    }
  },

  deleteStockEntryById: async (id) => {
    try {
      await deleteStockEntryByIdApi(id);
      await get().getAllStockEntries();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
