import type { TUpdateProductValidationSchema } from "@shared/validators/product.validator";
import axios, { type AxiosResponse } from "axios";
import {
  CREATE_PRODUCT_API,
  DELETE_BY_ID_API,
  GET_ALL_PRODUCT_ADMIN_API,
  GET_ALL_PRODUCT_API,
  GET_PRODUCT_BY_ID_API,
  UPDATE_PRODUCT_BY_ID_API,
} from "../utils/apiUrls";

export type TProductQueryParams = {
  search?: string;
  categories?: string;
  subCategories?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  offerId?: string;
  sortBy?: "productName" | "price" | "category";
  sortOrder?: "asc" | "desc";
  productStatus?: "true" | "false";
  newArrivalOnly?: boolean;
  page?: number;
  limit?: number;
};

export const getAllProductsApi = (params?: TProductQueryParams) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_PRODUCT_API(), { params })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const getAllProductsAdminApi = (params?: TProductQueryParams) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_PRODUCT_ADMIN_API(), { params, withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const getProductByIdApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_PRODUCT_BY_ID_API(id))
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createProductApi = (formData: FormData) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_PRODUCT_API(), formData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateProductByIdApi = (
  id: string,
  formData: TUpdateProductValidationSchema,
) => {
  const multipartFormData = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value instanceof File) multipartFormData.set(key, value);
    else multipartFormData.set(key, String(value));
  });

  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .put(UPDATE_PRODUCT_BY_ID_API(id), multipartFormData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteProductByIdApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_BY_ID_API(id), {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
