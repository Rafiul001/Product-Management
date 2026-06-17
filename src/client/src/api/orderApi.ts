import type {
  TOrderStatus,
  TPaymentMethod,
} from "@shared/constants/order/index";
import axios, { type AxiosResponse } from "axios";
import {
  CANCEL_ORDER_API,
  GET_ALL_ORDERS_ADMIN_API,
  GET_CRON_SETTINGS_API,
  GET_MY_ORDERS_API,
  PLACE_ORDER_DIRECT_API,
  PLACE_ORDER_FROM_CART_API,
  UPDATE_CRON_SETTINGS_API,
  UPDATE_ORDER_STATUS_ADMIN_API,
} from "../utils/apiUrls";

export const getMyOrdersApi = (): Promise<AxiosResponse> =>
  axios.get(GET_MY_ORDERS_API(), { withCredentials: true });

export const placeOrderFromCartApi = (
  paymentMethod: TPaymentMethod,
  deliveryAddress?: string,
): Promise<AxiosResponse> =>
  axios.post(
    PLACE_ORDER_FROM_CART_API(),
    { paymentMethod, ...(deliveryAddress && { deliveryAddress }) },
    { withCredentials: true },
  );

export const placeDirectOrderApi = (
  productId: string,
  quantity: number,
  paymentMethod: TPaymentMethod,
  deliveryAddress?: string,
): Promise<AxiosResponse> =>
  axios.post(
    PLACE_ORDER_DIRECT_API(),
    {
      productId,
      quantity,
      paymentMethod,
      ...(deliveryAddress && { deliveryAddress }),
    },
    { withCredentials: true },
  );

export const placeDirectOrderViaFormPost = (
  productId: string,
  quantity: number,
  paymentMethod: TPaymentMethod,
  deliveryAddress?: string,
): void => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = PLACE_ORDER_DIRECT_API();

  const fields: Record<string, string> = {
    productId,
    quantity: String(quantity),
    paymentMethod,
    ...(deliveryAddress && { deliveryAddress }),
  };
  for (const [name, value] of Object.entries(fields)) {
    const field = document.createElement("input");
    field.type = "hidden";
    field.name = name;
    field.value = value;
    form.appendChild(field);
  }

  document.body.appendChild(form);
  form.submit();
};

export const placeOrderViaFormPost = (
  paymentMethod: TPaymentMethod,
  deliveryAddress?: string,
): void => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = PLACE_ORDER_FROM_CART_API();

  const fields: Record<string, string> = {
    paymentMethod,
    ...(deliveryAddress && { deliveryAddress }),
  };
  for (const [name, value] of Object.entries(fields)) {
    const field = document.createElement("input");
    field.type = "hidden";
    field.name = name;
    field.value = value;
    form.appendChild(field);
  }

  document.body.appendChild(form);
  form.submit();
};

export const cancelOrderApi = (id: string): Promise<AxiosResponse> =>
  axios.patch(CANCEL_ORDER_API(id), {}, { withCredentials: true });

export const getAllOrdersAdminApi = (): Promise<AxiosResponse> =>
  axios.get(GET_ALL_ORDERS_ADMIN_API(), { withCredentials: true });

export const updateOrderStatusAdminApi = (
  id: string,
  orderStatus: TOrderStatus,
): Promise<AxiosResponse> =>
  axios.patch(
    UPDATE_ORDER_STATUS_ADMIN_API(id),
    { orderStatus },
    { withCredentials: true },
  );

export const getCronSettingsApi = (): Promise<AxiosResponse> =>
  axios.get(GET_CRON_SETTINGS_API(), { withCredentials: true });

export const updateCronSettingsApi = (
  startHour: number,
  endHour: number,
): Promise<AxiosResponse> =>
  axios.patch(
    UPDATE_CRON_SETTINGS_API(),
    { startHour, endHour },
    { withCredentials: true },
  );
