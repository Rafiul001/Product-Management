import type { TPaymentMethod } from "@shared/constants/order/index";
import { PAYMENT_METHOD } from "@shared/constants/order/index";
import type React from "react";
import { HiCheck } from "react-icons/hi";
import { Link } from "react-router";

export type TOrderResult = {
  orderId: string;
  paymentMethod: TPaymentMethod;
  paymentStatus: string;
  orderStatus: string;
};

const OrderSuccessView: React.FC<{ result: TOrderResult }> = ({ result }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
      <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
        <HiCheck className="w-8 h-8 text-success-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-gray-500 text-sm mb-6">
        Your order has been confirmed. Thank you for shopping with us.
      </p>
      <div className="bg-gray-50 rounded-xl p-4 text-left text-sm mb-6 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID</span>
          <span className="font-medium text-gray-800 text-xs break-all ml-4">
            {result.orderId}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment</span>
          <span className="font-medium text-gray-800">
            {result.paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY
              ? "Cash on Delivery"
              : "Online Banking"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="font-semibold text-success-600">
            {result.orderStatus}
          </span>
        </div>
      </div>
      <Link
        to="/"
        className="inline-block w-full py-3 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors text-center"
      >
        Continue Shopping
      </Link>
    </div>
  </div>
);

export default OrderSuccessView;
