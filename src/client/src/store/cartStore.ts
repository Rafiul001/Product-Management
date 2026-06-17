import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  addItemToCartApi,
  deleteCartApi,
  getCartApi,
  removeItemFromCartApi,
} from "../api/cartApi";

export type TCartItemPopulated = {
  _id: string;
  product: {
    _id: string;
    productName: string;
    price: number;
    productImage?: string;
  };
  unitPrice: number;
  quantity: number;
};

export type TCartPopulated = {
  _id: string;
  items: TCartItemPopulated[];
  totalPrice: number;
};

type TCartStore = {
  cart: TCartPopulated | null;
  cartLoading: boolean;
  addingToCart: boolean;
  getCart: () => Promise<void>;
  addItemToCart: (productId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (productId: string) => Promise<void>;
  deleteCart: () => Promise<void>;
};

export const useCartStore = create<TCartStore>((set, get) => ({
  cart: null,
  cartLoading: false,
  addingToCart: false,

  getCart: async () => {
    set({ cartLoading: true });
    try {
      const response = await getCartApi();
      set({ cart: response.data.data });
    } catch (err) {
      if (
        isAxiosError<{ message: string }>(err) &&
        err.response?.status !== 401
      ) {
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to load cart",
        });
      }
    } finally {
      set({ cartLoading: false });
    }
  },

  addItemToCart: async (productId, quantity) => {
    set({ addingToCart: true });
    try {
      await addItemToCartApi({ product: productId, quantity });
      await get().getCart();
      toast.success("Added to cart", {
        description: "Item added to your cart",
      });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        const status = err.response?.status;
        if (status === 401) {
          toast.danger("Sign in required", {
            description: "Please sign in to add items to your cart",
          });
        } else {
          toast.danger("Error", {
            description:
              err.response?.data.message ?? "Failed to add item to cart",
          });
        }
      }
    } finally {
      set({ addingToCart: false });
    }
  },

  removeItemFromCart: async (productId) => {
    try {
      await removeItemFromCartApi({ product: productId });
      await get().getCart();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to remove item",
        });
    }
  },

  deleteCart: async () => {
    try {
      await deleteCartApi();
      set({ cart: null });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to clear cart",
        });
    }
  },
}));
