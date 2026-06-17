import type {
  TRegisterBodySchema,
  TResendVerificationEmailBodySchema,
  TUpdateAddressValidationSchema,
  TUpdateProfileValidationSchema,
  TUpdateUserAdminBodySchema,
  TUserLoginBodySchema,
  TVerifyEmailBodyValidationSchema,
} from "@shared/validators/user.validator";
import axios from "axios";
import {
  GET_ALL_USERS_ADMIN_API,
  GET_USER_INFO_API,
  GET_USER_PROFILE_API,
  UPDATE_ADDRESS_API,
  UPDATE_PROFILE_API,
  UPDATE_USER_ADMIN_API,
  USER_LOGIN_API,
  USER_LOGOUT_API,
  USER_REFRESH_API,
  USER_REGISTER_API,
  USER_RESEND_OTP_API,
  USER_VERIFY_EMAIL_API,
} from "../utils/apiUrls";

const userAxios = axios.create({ withCredentials: true });

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

userAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh") &&
      !originalRequest.url?.includes("/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(userAxios(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(USER_REFRESH_API(), {}, { withCredentials: true });
        onRefreshed();
        isRefreshing = false;
        return userAxios(originalRequest);
      } catch {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export const userRegister = (data: TRegisterBodySchema) =>
  userAxios.post(USER_REGISTER_API(), data);

export const userVerifyEmail = (data: TVerifyEmailBodyValidationSchema) =>
  userAxios.post(USER_VERIFY_EMAIL_API(), data);

export const userResendOtp = (data: TResendVerificationEmailBodySchema) =>
  userAxios.post(USER_RESEND_OTP_API(), data);

export const userLogin = (data: TUserLoginBodySchema) =>
  userAxios.post(USER_LOGIN_API(), data);

export const userLogout = () => userAxios.post(USER_LOGOUT_API(), {});

export const getUserInfo = () => userAxios.get(GET_USER_INFO_API());

export const getUserProfile = () => userAxios.get(GET_USER_PROFILE_API());

export const updateProfile = (data: TUpdateProfileValidationSchema) =>
  userAxios.patch(UPDATE_PROFILE_API(), data);

export const updateAddress = (data: TUpdateAddressValidationSchema) =>
  userAxios.patch(UPDATE_ADDRESS_API(), data);

export const getAllUsersAdminApi = () =>
  axios.get(GET_ALL_USERS_ADMIN_API(), { withCredentials: true });

export const updateUserAdminApi = (
  id: string,
  data: TUpdateUserAdminBodySchema,
) => axios.patch(UPDATE_USER_ADMIN_API(id), data, { withCredentials: true });
