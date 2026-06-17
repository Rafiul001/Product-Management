import type {
  TCreateSubCategoryValidationSchema,
  TUpdateSubCategoryValidationSchema,
} from "@shared/validators/subCategory.validator";
import axios, { type AxiosResponse } from "axios";
import {
  CREATE_SUB_CATEGORY_API,
  DELETE_SUB_CATEGORY_API,
  GET_ALL_SUB_CATEGORY_API,
  UPDATE_SUB_CATEGORY_API,
} from "../utils/apiUrls";

export const getSubCategoriesApi = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_SUB_CATEGORY_API())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createSubCategoryApi = (
  formData: TCreateSubCategoryValidationSchema,
) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_SUB_CATEGORY_API(), formData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateSubCategoryApi = (
  id: string,
  formData: TUpdateSubCategoryValidationSchema,
) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .put(UPDATE_SUB_CATEGORY_API(id), formData, {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteSubCategoryApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_SUB_CATEGORY_API(id), {
        withCredentials: true,
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
