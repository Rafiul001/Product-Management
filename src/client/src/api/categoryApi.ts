import type {
  TCreateCategoryValidationSchema,
  TUpdateCategoryValidationSchema,
} from "@shared/validators/category.validator";
import axios, { type AxiosResponse } from "axios";
import {
  CREATE_CATEGORY_API,
  DELETE_CATEGORY_API,
  GET_ALL_CATEGORY_API,
  UPDATE_CATEGORY_API,
} from "../utils/apiUrls";

export const getCategoriesApi = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_CATEGORY_API())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createCategoryApi = (
  formData: TCreateCategoryValidationSchema,
) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_CATEGORY_API(), formData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateCategoryApi = (
  id: string,
  formData: TUpdateCategoryValidationSchema,
) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .put(UPDATE_CATEGORY_API(id), formData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteCategoryApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_CATEGORY_API(id), {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
