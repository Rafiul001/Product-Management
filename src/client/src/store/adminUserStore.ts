import { getAllUsersAdminApi, updateUserAdminApi } from "@/api/userApi";
import { toast } from "@heroui/react";
import type { TUpdateUserAdminBodySchema } from "@shared/validators/user.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";

export type TAdminUser = {
  _id: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  address: string;
  dateOfBirth: string;
  isVerified: boolean;
  createdAt: string;
};

type TAdminUserStore = {
  users: TAdminUser[];
  usersLoading: boolean;

  fetchAllUsers: () => Promise<void>;
  updateUser: (
    id: string,
    data: TUpdateUserAdminBodySchema,
  ) => Promise<boolean>;
};

export const useAdminUserStore = create<TAdminUserStore>((set, get) => ({
  users: [],
  usersLoading: false,

  fetchAllUsers: async () => {
    set({ usersLoading: true });
    try {
      const response = await getAllUsersAdminApi();
      set({ users: response.data.data });
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to load users",
        });
    } finally {
      set({ usersLoading: false });
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await updateUserAdminApi(id, data);
      const updated = response.data.data;
      set({
        users: get().users.map((u) =>
          u._id === id ? { ...u, ...updated } : u,
        ),
      });
      toast.success("User updated successfully");
      return true;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger("Error", {
          description: err.response?.data.message ?? "Failed to update user",
        });
      return false;
    }
  },
}));
