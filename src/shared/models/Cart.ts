import { DB } from "@shared/constants/DB.js";
import "@shared/models/User.js";
import "@shared/models/Product.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, type Types } from "mongoose";

interface ICartItem {
  product: Types.ObjectId;
  unitPrice: number;
  quantity: number;
}

interface ICartModel {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;

  createdAt: Date;
  updatedAt: Date;
}

export type TCartDocument = TWithObjectId<ICartModel>;

const cartSchema = new Schema<ICartModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DB.USER,
      required: true,
      unique: true,
    },
    items: [
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
  },
  { timestamps: true },
);

cartSchema.pre("save", async function () {
  const cart = this as ICartModel;
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
});

export const Cart = model(DB.CART, cartSchema);
