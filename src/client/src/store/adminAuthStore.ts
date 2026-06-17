import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import { create } from "zustand";
import { adminLogin, adminLogout, getAdminInfo } from "../api/adminApi";
import type { TLoginBodySchema } from "@shared/validators/admin.validator";

type TAdminStore = {
  isLoggedIn: boolean;
  admin: {
    adminUserName: string;
    adminEmail: string;
    adminType: string;
  };

  login: (credentials: TLoginBodySchema) => Promise<void>;
  logout: () => Promise<void>;
  getInfo: () => Promise<void>;
};

const defaultValue = {
  isLoggedIn: false,
  adminUserName: "",
  adminEmail: "",
  adminType: "",
};

const useAdminAuthStore = create<TAdminStore>((set, get) => ({
  isLoggedIn: false,
  admin: {
    adminUserName: "",
    adminEmail: "",
    adminType: "",
  },

  login: async (credentials: TLoginBodySchema) => {
    try {
      const response = await adminLogin(credentials);
      if (response.status < 400) {
        toast.success(response.data.message);
        await get().getInfo();
      }
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger(err.response?.data.message ?? "Something went wrong");
      set(defaultValue);
    }
  },

  logout: async () => {
    try {
      const response = await adminLogout();
      if (response.status < 400) set(defaultValue);
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger(err.response?.data.message ?? "Something went wrong");
      set(defaultValue);
    }
  },

  getInfo: async () => {
    try {
      const response = await getAdminInfo();
      if (response.status < 400)
        set({
          isLoggedIn: true,
          admin: {
            adminUserName: response.data.data.adminUserName,
            adminEmail: response.data.data.adminEmail,
            adminType: response.data.data.adminType,
          },
        });
    } catch {
      set(defaultValue);
    }
  },
}));

export default useAdminAuthStore;
