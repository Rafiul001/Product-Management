import type { TUpdateBannerValidationSchema } from "@shared/validators/banner.validator";
import axios, { type AxiosResponse } from "axios";
import {
  CREATE_BANNER_API,
  DELETE_BANNER_BY_ID_API,
  GET_ALL_BANNERS_API,
  UPDATE_BANNER_BY_ID_API,
} from "../utils/apiUrls";

export const getAllBannersApi = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_BANNERS_API())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createBannerApi = (formData: FormData) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_BANNER_API(), formData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateBannerByIdApi = (
  id: string,
  formData: TUpdateBannerValidationSchema,
) => {
  const multipartFormData = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value instanceof File) multipartFormData.set(key, value);
    else multipartFormData.set(key, String(value));
  });

  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .put(UPDATE_BANNER_BY_ID_API(id), multipartFormData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteBannerByIdApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_BANNER_BY_ID_API(id), {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
