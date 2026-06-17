import type {
  TAddItemToCartValidation,
  TRemoveItemFromCartValidation,
} from "@shared/validators/cart.validator";
import axios, { type AxiosResponse } from "axios";
import {
  ADD_ITEM_TO_CART_API,
  DELETE_CART_API,
  GET_CART_API,
  REMOVE_ITEM_FROM_CART_API,
} from "../utils/apiUrls";

export const getCartApi = (): Promise<AxiosResponse> =>
  axios.get(GET_CART_API(), { withCredentials: true });

export const addItemToCartApi = (
  data: TAddItemToCartValidation,
): Promise<AxiosResponse> =>
  axios.patch(ADD_ITEM_TO_CART_API(), data, { withCredentials: true });

export const removeItemFromCartApi = (
  data: TRemoveItemFromCartValidation,
): Promise<AxiosResponse> =>
  axios.patch(REMOVE_ITEM_FROM_CART_API(), data, { withCredentials: true });

export const deleteCartApi = (): Promise<AxiosResponse> =>
  axios.delete(DELETE_CART_API(), { withCredentials: true });
