import type { ValidatedRequest } from "@server/middleware/validator.js";
import { Cart } from "@shared/models/Cart.js";
import { OfferModel } from "@shared/models/Offer.js";
import { ProductModel } from "@shared/models/Product.js";
import { badRequest, notFound, ok } from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import { getBestOfferedPrice } from "@shared/utils/offerPrice.js";
import type {
  TAddItemToCartValidation,
  TRemoveItemFromCartValidation,
} from "@shared/validators/cart.validator.js";
import { Types } from "mongoose";

export const getCartController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const userId = req.userId!;
    const cart = await Cart.findOne({ user: userId })
      .populate("user", "_id userName userEmail")
      .populate("items.product", "_id productName price productImage");
    return ok(res, "Cart retrieved successfully", cart);
  },
);

export const addItemToCartController = asyncController<
  ValidatedRequest<{ body: TAddItemToCartValidation }>
>(async (req, res) => {
  const userId = req.userId!;
  const { product, quantity } = req.validatedBody;

  const productDoc =
    await ProductModel.findById(product).select("price quantity");
  if (!productDoc) return notFound(res, "Product not found");

  const now = new Date();
  const activeOffers = await OfferModel.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  const offeredPrice = getBestOfferedPrice(
    productDoc.price,
    productDoc._id as Types.ObjectId,
    activeOffers,
  );

  const unitPrice = offeredPrice ?? productDoc.price;
  const stock = productDoc.quantity;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    if (quantity > stock)
      return badRequest(res, `Only ${stock} unit(s) available in stock`);
    cart = new Cart({
      user: userId,
      items: [{ product, unitPrice, quantity }],
    });
  } else {
    const idx = cart.items.findIndex((i) => i.product.toString() === product);
    if (idx >= 0) {
      const newTotal = cart.items[idx]!.quantity + quantity;
      if (newTotal > stock)
        return badRequest(res, `Only ${stock} unit(s) available in stock`);
      cart.items[idx]!.quantity = newTotal;
      cart.items[idx]!.unitPrice = unitPrice;
    } else {
      if (quantity > stock)
        return badRequest(res, `Only ${stock} unit(s) available in stock`);
      cart.items.push({ product: product as never, unitPrice, quantity });
    }
  }

  await cart.save();
  return ok(res, "Item added to cart successfully");
});

export const removeItemFromCartController = asyncController<
  ValidatedRequest<{ body: TRemoveItemFromCartValidation }>
>(async (req, res) => {
  const userId = req.userId!;
  const { product } = req.validatedBody;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return notFound(res, "Cart not found");

  cart.items = cart.items.filter((i) => i.product.toString() !== product);
  await cart.save();
  return ok(res, "Item removed from cart successfully");
});

export const deleteCartController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const userId = req.userId!;
    await Cart.findOneAndDelete({ user: userId });
    return ok(res, "Cart deleted successfully");
  },
);
