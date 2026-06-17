import type { TLoginBodySchema } from "@shared/validators/admin.validator";
import axios, { type AxiosResponse } from "axios";
import {
  ADMIN_LOGIN_API,
  ADMIN_LOGOUT_API,
  GET_ADMIN_INFO,
} from "../utils/apiUrls";

export const getAdminInfo = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ADMIN_INFO(), {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const adminLogin = (credentials: TLoginBodySchema) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(
        ADMIN_LOGIN_API(),
        {
          adminUserName: credentials.adminUserName,
          password: credentials.password,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const adminLogout = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(
        ADMIN_LOGOUT_API(),
        {},
        {
          withCredentials: true,
        },
      )
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
