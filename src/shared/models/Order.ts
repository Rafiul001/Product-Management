import { DB } from "@shared/constants/DB.js";
import {
  ORDER_STATUS,
  orderStatuses,
  PAYMENT_STATUS,
  paymentMethods,
  paymentStatuses,
  REFUND_STATUS,
  refundStatuses,
  type TOrderStatus,
  type TPaymentMethod,
  type TPaymentStatus,
  type TRefundStatus,
} from "@shared/constants/order/index.js";
import { model, Schema, type Types } from "mongoose";

interface IProductListItem {
  product: Types.ObjectId;
  unitPrice: number;
  quantity: number;
}

interface IRefund {
  refundId: string;
  amount: number;
  reason: string;
  status: TRefundStatus;
}

interface IOrderModel {
  user: Types.ObjectId;
  productList: IProductListItem[];
  totalPrice: number;
  orderStatus: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentMethod: TPaymentMethod;
  refundStatus: IRefund;
  deliveryAddress?: string;
  cancellationNote?: string;
  bankTransactionId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrderModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: DB.USER, required: true },
    productList: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: DB.PRODUCT,
          required: true,
        },
        unitPrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      enum: orderStatuses,
      required: true,
      default: ORDER_STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatuses,
      required: true,
      default: PAYMENT_STATUS.DUE,
    },
    paymentMethod: {
      type: String,
      enum: paymentMethods,
      required: true,
    },
    refundStatus: {
      refundId: { type: String, default: null },
      amount: { type: Number, default: 0 },
      reason: { type: String, default: "" },
      status: {
        type: String,
        enum: refundStatuses,
        default: REFUND_STATUS.PENDING,
      },
    },
    deliveryAddress: { type: String },
    cancellationNote: { type: String, default: null },
    bankTransactionId: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);

export const OrderModel = model(DB.ORDER, orderSchema);
