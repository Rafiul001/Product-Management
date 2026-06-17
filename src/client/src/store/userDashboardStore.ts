import { cancelOrderApi, getMyOrdersApi } from "@/api/orderApi";
import { getUserProfile, updateAddress, updateProfile } from "@/api/userApi";
import { toast } from "@heroui/react";
import type {
  TOrderStatus,
  TPaymentMethod,
  TPaymentStatus,
} from "@shared/constants/order/index";
import { isAxiosError } from "axios";
import { create } from "zustand";

export type TOrderProduct = {
  _id: string;
  productName: string;
  productImage?: string;
};

export type TOrderItem = {
  _id: string;
  product: TOrderProduct;
  unitPrice: number;
  quantity: number;
};

export type TMyOrder = {
  _id: string;
  productList: TOrderItem[];
  totalPrice: number;
  orderStatus: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentMethod: TPaymentMethod;
  cancellationNote?: string;
  createdAt: string;
};

export type TUserProfile = {
  _id: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  userImageUrl?: string;
  address: string;
  dateOfBirth: string;
};

type TProfileFields = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  dateOfBirth: string;
};

type TUserDashboardStore = {
  profile: TUserProfile | null;
  profileLoading: boolean;
  profileUpdating: boolean;
  addressUpdating: boolean;

  orders: TMyOrder[];
  ordersLoading: boolean;

  fetchProfile: () => Promise<void>;
  updateUserProfile: (fields: TProfileFields) => Promise<boolean>;
  updateUserAddress: (address: string) => Promise<boolean>;
  fetchMyOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<boolean>;
};

export const useUserDashboardStore = create<TUserDashboardStore>((set) => ({
  profile: null,
  profileLoading: false,
  profileUpdating: false,
  addressUpdating: false,

  orders: [],
  ordersLoading: false,

  fetchProfile: async () => {
    set({ profileLoading: true });
    try {
      const response = await getUserProfile();
      set({ profile: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to load profile",
        });
      }
    } finally {
      set({ profileLoading: false });
    }
  },

  updateUserProfile: async ({
    userName,
    userEmail,
    userPhoneNumber,
    dateOfBirth,
  }) => {
    set({ profileUpdating: true });
    try {
      await updateProfile({
        userName,
        userEmail,
        userPhoneNumber,
        dateOfBirth: new Date(dateOfBirth),
      });
      set((state) =>
        state.profile
          ? {
              profile: {
                ...state.profile,
                userName,
                userEmail,
                userPhoneNumber,
                dateOfBirth,
              },
            }
          : {},
      );
      toast.success("Profile updated", {
        description: "Your account details have been saved.",
      });
      return true;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to update profile",
        });
      }
      return false;
    } finally {
      set({ profileUpdating: false });
    }
  },

  updateUserAddress: async (address) => {
    set({ addressUpdating: true });
    try {
      await updateAddress({ address });
      set((state) =>
        state.profile ? { profile: { ...state.profile, address } } : {},
      );
      toast.success("Address updated", {
        description: "Your address has been saved.",
      });
      return true;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to update address",
        });
      }
      return false;
    } finally {
      set({ addressUpdating: false });
    }
  },

  fetchMyOrders: async () => {
    set({ ordersLoading: true });
    try {
      const response = await getMyOrdersApi();
      set({ orders: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to load orders",
        });
      }
    } finally {
      set({ ordersLoading: false });
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await cancelOrderApi(orderId);
      const cancellationNote = response.data?.data?.cancellationNote as
        | string
        | undefined;
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === orderId
            ? {
                ...o,
                orderStatus: "CANCELLED",
                ...(cancellationNote && { cancellationNote }),
              }
            : o,
        ),
      }));
      toast.success("Order cancelled", {
        description: "Your order has been cancelled successfully.",
      });
      return true;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to cancel order",
        });
      }
      return false;
    }
  },
}));
