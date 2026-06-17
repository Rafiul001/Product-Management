import type {
  TCreateReviewValidationSchema,
  TUpdateReviewValidationSchema,
} from "@shared/validators/review.validator";
import axios, { type AxiosResponse } from "axios";
import {
  CREATE_REVIEW_API,
  DELETE_REVIEW_API,
  GET_REVIEWS_BY_PRODUCT_API,
  UPDATE_REVIEW_API,
} from "../utils/apiUrls";

export const getReviewsByProductApi = (productId: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_REVIEWS_BY_PRODUCT_API(productId))
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createReviewApi = (data: TCreateReviewValidationSchema) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_REVIEW_API(), data, { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateReviewApi = (
  id: string,
  data: TUpdateReviewValidationSchema,
) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .put(UPDATE_REVIEW_API(id), data, { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteReviewApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_REVIEW_API(id), { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
