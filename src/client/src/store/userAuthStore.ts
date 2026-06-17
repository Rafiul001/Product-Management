import { toast } from "@heroui/react";
import type {
  TRegisterBodySchema,
  TResendVerificationEmailBodySchema,
  TUserLoginBodySchema,
  TVerifyEmailBodyValidationSchema,
} from "@shared/validators/user.validator";
import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  getUserInfo,
  userLogin,
  userLogout,
  userRegister,
  userResendOtp,
  userVerifyEmail,
} from "../api/userApi";

type TUserStore = {
  isLoggedIn: boolean;
  authInitialized: boolean;
  user: {
    _id: string;
    userName: string;
    userEmail: string;
    userPhoneNumber: string;
    userImageUrl?: string;
  };

  getInfo: () => Promise<void>;
  login: (credentials: TUserLoginBodySchema) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: TRegisterBodySchema) => Promise<boolean>;
  verifyEmail: (data: TVerifyEmailBodyValidationSchema) => Promise<boolean>;
  resendOtp: (data: TResendVerificationEmailBodySchema) => Promise<void>;
};

const defaultUser = {
  _id: "",
  userName: "",
  userEmail: "",
  userPhoneNumber: "",
};

const useUserAuthStore = create<TUserStore>((set, get) => ({
  isLoggedIn: false,
  authInitialized: false,
  user: defaultUser,

  getInfo: async () => {
    try {
      const response = await getUserInfo();
      if (response.status < 400) {
        set({
          isLoggedIn: true,
          authInitialized: true,
          user: {
            _id: response.data.data._id,
            userName: response.data.data.userName,
            userEmail: response.data.data.userEmail,
            userPhoneNumber: response.data.data.userPhoneNumber,
            userImageUrl: response.data.data.userImageUrl,
          },
        });
        return;
      }
    } catch {
      // not authenticated
    }
    set({ isLoggedIn: false, authInitialized: true, user: defaultUser });
  },

  login: async (credentials: TUserLoginBodySchema) => {
    try {
      const response = await userLogin(credentials);
      if (response.status < 400) {
        toast.success(response.data.message);
        await get().getInfo();
        return true;
      }
      return false;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger(err.response?.data.message ?? "Login failed");
      return false;
    }
  },

  logout: async () => {
    try {
      await userLogout();
    } catch {
      // ignore errors — always clear local state
    } finally {
      set({ isLoggedIn: false, user: defaultUser });
    }
  },

  register: async (data: TRegisterBodySchema) => {
    try {
      const response = await userRegister(data);
      if (response.status < 400) {
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger(err.response?.data.message ?? "Registration failed");
      return false;
    }
  },

  verifyEmail: async (data: TVerifyEmailBodyValidationSchema) => {
    try {
      const response = await userVerifyEmail(data);
      if (response.status < 400) {
        toast.success(response.data.message);
        return true;
      }
      return false;
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger(err.response?.data.message ?? "Verification failed");
      return false;
    }
  },

  resendOtp: async (data: TResendVerificationEmailBodySchema) => {
    try {
      const response = await userResendOtp(data);
      if (response.status < 400) toast.success(response.data.message);
    } catch (err) {
      if (isAxiosError<{ message: string }>(err))
        toast.danger(err.response?.data.message ?? "Failed to resend OTP");
    }
  },
}));

export default useUserAuthStore;
