import axios, { type AxiosResponse } from "axios";
import {
  ADD_NEW_ARRIVAL_API,
  GET_ALL_NEW_ARRIVALS_API,
  REMOVE_NEW_ARRIVAL_API,
} from "../utils/apiUrls";

export const getAllNewArrivalsApi = () =>
  axios.get(GET_ALL_NEW_ARRIVALS_API()) as Promise<AxiosResponse>;

export const addNewArrivalApi = (productId: string) =>
  axios.post(
    ADD_NEW_ARRIVAL_API(),
    { productId },
    { withCredentials: true },
  ) as Promise<AxiosResponse>;

export const removeNewArrivalApi = (productId: string) =>
  axios.delete(REMOVE_NEW_ARRIVAL_API(productId), {
    withCredentials: true,
  }) as Promise<AxiosResponse>;
