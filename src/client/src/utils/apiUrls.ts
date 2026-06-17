import { API_HOST_NAME } from "./config";

// Admin API Routes
export const ADMIN_LOGIN_API = () => `${API_HOST_NAME}/api/v1/admin/login`;
export const ADMIN_LOGOUT_API = () => `${API_HOST_NAME}/api/v1/admin/logout`;
export const GET_ADMIN_INFO = () => `${API_HOST_NAME}/api/v1/admin/me`;

// Category API Routes
export const GET_ALL_CATEGORY_API = () => `${API_HOST_NAME}/api/v1/category`;
export const CREATE_CATEGORY_API = () =>
  `${API_HOST_NAME}/api/v1/category/create`;
export const UPDATE_CATEGORY_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/category/update/${id}`;
export const DELETE_CATEGORY_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/category/delete/${id}`;

// Sub category API Routes
export const GET_ALL_SUB_CATEGORY_API = () =>
  `${API_HOST_NAME}/api/v1/sub-category`;
export const CREATE_SUB_CATEGORY_API = () =>
  `${API_HOST_NAME}/api/v1/sub-category/create`;
export const UPDATE_SUB_CATEGORY_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/sub-category/update/${id}`;
export const DELETE_SUB_CATEGORY_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/sub-category/delete/${id}`;

// Product API Routes
export const GET_ALL_PRODUCT_API = () =>
  `${API_HOST_NAME}/api/v1/product/get-all`;
export const GET_ALL_PRODUCT_ADMIN_API = () =>
  `${API_HOST_NAME}/api/v1/product/admin/get-all`;
export const GET_PRODUCT_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/product/get/${id}`;
export const CREATE_PRODUCT_API = () =>
  `${API_HOST_NAME}/api/v1/product/create`;
export const UPDATE_PRODUCT_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/product/update/${id}`;
export const DELETE_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/product/delete/${id}`;

// Banner API Routes
export const GET_ALL_BANNERS_API = () =>
  `${API_HOST_NAME}/api/v1/banner/get-all`;
export const CREATE_BANNER_API = () => `${API_HOST_NAME}/api/v1/banner/create`;
export const UPDATE_BANNER_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/banner/update/${id}`;
export const DELETE_BANNER_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/banner/delete/${id}`;

// Stock Entry API Routes
export const GET_ALL_STOCK_ENTRIES_API = () =>
  `${API_HOST_NAME}/api/v1/stock-entry/get-all`;
export const GET_STOCK_ENTRY_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/stock-entry/get/${id}`;
export const CREATE_STOCK_ENTRY_API = () =>
  `${API_HOST_NAME}/api/v1/stock-entry/create`;
export const DELETE_STOCK_ENTRY_BY_ID_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/stock-entry/delete/${id}`;

// Review API Routes
export const GET_REVIEWS_BY_PRODUCT_API = (productId: string) =>
  `${API_HOST_NAME}/api/v1/review/product/${productId}`;
export const CREATE_REVIEW_API = () => `${API_HOST_NAME}/api/v1/review/create`;
export const UPDATE_REVIEW_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/review/update/${id}`;
export const DELETE_REVIEW_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/review/delete/${id}`;

// Admin User API Routes
export const GET_ALL_USERS_ADMIN_API = () =>
  `${API_HOST_NAME}/api/v1/user/admin/get-all`;
export const UPDATE_USER_ADMIN_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/user/admin/update/${id}`;

// User API Routes
export const USER_REGISTER_API = () => `${API_HOST_NAME}/api/v1/user/register`;
export const USER_VERIFY_EMAIL_API = () =>
  `${API_HOST_NAME}/api/v1/user/verify`;
export const USER_RESEND_OTP_API = () => `${API_HOST_NAME}/api/v1/user/resend`;
export const USER_LOGIN_API = () => `${API_HOST_NAME}/api/v1/user/login`;
export const USER_LOGOUT_API = () => `${API_HOST_NAME}/api/v1/user/logout`;
export const USER_REFRESH_API = () => `${API_HOST_NAME}/api/v1/user/refresh`;
export const GET_USER_INFO_API = () => `${API_HOST_NAME}/api/v1/user/me`;
export const GET_USER_PROFILE_API = () =>
  `${API_HOST_NAME}/api/v1/user/profile`;
export const UPDATE_PROFILE_API = () =>
  `${API_HOST_NAME}/api/v1/user/update-profile`;
export const UPDATE_ADDRESS_API = () =>
  `${API_HOST_NAME}/api/v1/user/update-address`;

// Offer API Routes
export const GET_ACTIVE_OFFERS_API = () =>
  `${API_HOST_NAME}/api/v1/offer/active`;
export const GET_ALL_OFFERS_API = () => `${API_HOST_NAME}/api/v1/offer/get-all`;
export const CREATE_OFFER_API = () => `${API_HOST_NAME}/api/v1/offer/create`;
export const UPDATE_OFFER_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/offer/update/${id}`;
export const DELETE_OFFER_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/offer/delete/${id}`;

// Order API Routes
export const GET_MY_ORDERS_API = () =>
  `${API_HOST_NAME}/api/v1/order/my-orders`;
export const CANCEL_ORDER_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/order/${id}/cancel`;
export const PLACE_ORDER_FROM_CART_API = () =>
  `${API_HOST_NAME}/api/v1/order/place-from-cart`;
export const PLACE_ORDER_DIRECT_API = () =>
  `${API_HOST_NAME}/api/v1/order/place-direct`;
export const GET_ALL_ORDERS_ADMIN_API = () =>
  `${API_HOST_NAME}/api/v1/order/admin/get-all`;
export const UPDATE_ORDER_STATUS_ADMIN_API = (id: string) =>
  `${API_HOST_NAME}/api/v1/order/admin/update-status/${id}`;

// Cron Settings API Routes
export const GET_CRON_SETTINGS_API = () =>
  `${API_HOST_NAME}/api/v1/cron-settings`;
export const UPDATE_CRON_SETTINGS_API = () =>
  `${API_HOST_NAME}/api/v1/cron-settings`;

// New Arrival API Routes
export const GET_ALL_NEW_ARRIVALS_API = () =>
  `${API_HOST_NAME}/api/v1/new-arrival/get-all`;
export const ADD_NEW_ARRIVAL_API = () =>
  `${API_HOST_NAME}/api/v1/new-arrival/add`;
export const REMOVE_NEW_ARRIVAL_API = (productId: string) =>
  `${API_HOST_NAME}/api/v1/new-arrival/remove/${productId}`;

// Cart API Routes
export const GET_CART_API = () => `${API_HOST_NAME}/api/v1/cart/get`;
export const ADD_ITEM_TO_CART_API = () =>
  `${API_HOST_NAME}/api/v1/cart/add-item`;
export const REMOVE_ITEM_FROM_CART_API = () =>
  `${API_HOST_NAME}/api/v1/cart/remove-item`;
export const DELETE_CART_API = () => `${API_HOST_NAME}/api/v1/cart/delete`;
