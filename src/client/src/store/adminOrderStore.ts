import {
  getAllOrdersAdminApi,
  getCronSettingsApi,
  updateCronSettingsApi,
  updateOrderStatusAdminApi,
} from "@/api/orderApi";
import { toast } from "@heroui/react";
import type {
  TOrderStatus,
  TPaymentMethod,
  TPaymentStatus,
} from "@shared/constants/order/index";
import { isAxiosError } from "axios";
import { create } from "zustand";

export type TAdminOrderUser = {
  _id: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  address: string;
};

export type TAdminOrderProduct = {
  _id: string;
  productName: string;
  productImage?: string;
};

export type TAdminOrderItem = {
  _id: string;
  product: TAdminOrderProduct;
  unitPrice: number;
  quantity: number;
};

export type TAdminOrder = {
  _id: string;
  user: TAdminOrderUser;
  productList: TAdminOrderItem[];
  totalPrice: number;
  orderStatus: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentMethod: TPaymentMethod;
  cancellationNote?: string;
  createdAt: string;
};

export type TCronSettings = {
  startHour: number;
  endHour: number;
};

type TAdminOrderStore = {
  orders: TAdminOrder[];
  ordersLoading: boolean;

  cronSettings: TCronSettings | null;
  cronSettingsLoading: boolean;

  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, orderStatus: TOrderStatus) => Promise<void>;
  fetchCronSettings: () => Promise<void>;
  saveCronSettings: (startHour: number, endHour: number) => Promise<void>;
};

export const useAdminOrderStore = create<TAdminOrderStore>((set, get) => ({
  orders: [],
  ordersLoading: false,

  cronSettings: null,
  cronSettingsLoading: false,

  fetchAllOrders: async () => {
    set({ ordersLoading: true });
    try {
      const response = await getAllOrdersAdminApi();
      set({ orders: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to load orders",
        });
    } finally {
      set({ ordersLoading: false });
    }
  },

  updateOrderStatus: async (id, orderStatus) => {
    try {
      const response = await updateOrderStatusAdminApi(id, orderStatus);
      const cancellationNote = response.data?.data?.cancellationNote as
        | string
        | undefined;
      set({
        orders: get().orders.map((o) =>
          o._id === id
            ? {
                ...o,
                orderStatus,
                ...(cancellationNote && { cancellationNote }),
              }
            : o,
        ),
      });
      toast.success("Status updated");
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description:
            err.response?.data.message ?? "Failed to update order status",
        });
    }
  },

  fetchCronSettings: async () => {
    set({ cronSettingsLoading: true });
    try {
      const response = await getCronSettingsApi();
      set({ cronSettings: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description:
            err.response?.data.message ?? "Failed to load cron settings",
        });
    } finally {
      set({ cronSettingsLoading: false });
    }
  },

  saveCronSettings: async (startHour, endHour) => {
    try {
      const response = await updateCronSettingsApi(startHour, endHour);
      set({ cronSettings: response.data.data });
      toast.success("Cron settings saved");
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description:
            err.response?.data.message ?? "Failed to save cron settings",
        });
    }
  },
}));
