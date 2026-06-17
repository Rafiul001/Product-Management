import { toast } from "@heroui/react";
import type { TOfferDocument } from "@shared/models/Offer";
import type {
  TCreateOfferValidationSchema,
  TUpdateOfferValidationSchema,
} from "@shared/validators/offer.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  createOfferApi,
  deleteOfferApi,
  getActiveOffersApi,
  getAllOffersApi,
  updateOfferApi,
} from "../api/offerApi";

type TOfferStore = {
  offers: TOfferDocument[];
  activeOffers: TOfferDocument[];

  getAllOffers: () => Promise<void>;
  getActiveOffers: () => Promise<void>;
  createOffer: (formData: TCreateOfferValidationSchema) => Promise<void>;
  updateOffer: (
    id: string,
    formData: TUpdateOfferValidationSchema,
  ) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
};

export const useOfferStore = create<TOfferStore>((set, get) => ({
  offers: [],
  activeOffers: [],

  getAllOffers: async () => {
    try {
      const response = await getAllOffersApi();
      if (response.status < 400) set({ offers: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  getActiveOffers: async () => {
    try {
      const response = await getActiveOffersApi();
      if (response.status < 400) set({ activeOffers: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  createOffer: async (formData) => {
    try {
      const response = await createOfferApi(formData);
      if (response.status < 400) {
        toast.success("Success", { description: "Offer created successfully" });
        await get().getAllOffers();
      }
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  updateOffer: async (id, formData) => {
    try {
      const response = await updateOfferApi(id, formData);
      if (response.status < 400) {
        toast.success("Success", { description: "Offer updated successfully" });
        await get().getAllOffers();
      }
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },

  deleteOffer: async (id) => {
    try {
      const response = await deleteOfferApi(id);
      if (response.status < 400) {
        toast.success("Success", { description: "Offer deleted successfully" });
        await get().getAllOffers();
      }
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Something went wrong",
        });
    }
  },
}));
