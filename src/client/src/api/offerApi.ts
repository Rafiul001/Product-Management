import type {
  TCreateOfferValidationSchema,
  TUpdateOfferValidationSchema,
} from "@shared/validators/offer.validator";
import axios, { type AxiosResponse } from "axios";
import {
  CREATE_OFFER_API,
  DELETE_OFFER_API,
  GET_ACTIVE_OFFERS_API,
  GET_ALL_OFFERS_API,
  UPDATE_OFFER_API,
} from "../utils/apiUrls";

export const getActiveOffersApi = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ACTIVE_OFFERS_API())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const getAllOffersApi = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_OFFERS_API(), { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createOfferApi = (formData: TCreateOfferValidationSchema) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_OFFER_API(), formData, { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateOfferApi = (
  id: string,
  formData: TUpdateOfferValidationSchema,
) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .put(UPDATE_OFFER_API(id), formData, { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteOfferApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_OFFER_API(id), { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
