import axios, { type AxiosResponse } from "axios";
import {
  CREATE_STOCK_ENTRY_API,
  DELETE_STOCK_ENTRY_BY_ID_API,
  GET_ALL_STOCK_ENTRIES_API,
  GET_STOCK_ENTRY_BY_ID_API,
} from "../utils/apiUrls";

export const getAllStockEntriesApi = () => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_ALL_STOCK_ENTRIES_API(), { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const getStockEntryByIdApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .get(GET_STOCK_ENTRY_BY_ID_API(id), { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const createStockEntryApi = (formData: FormData) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .post(CREATE_STOCK_ENTRY_API(), formData, { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const deleteStockEntryByIdApi = (id: string) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    axios
      .delete(DELETE_STOCK_ENTRY_BY_ID_API(id), { withCredentials: true })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
