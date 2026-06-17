import type { Types } from "mongoose";

type TOfferLike = {
  discountType: "percentage" | "flat";
  discountValue: number;
  applicableProducts: Types.ObjectId[];
};

export function computeOfferedPrice(price: number, offer: TOfferLike): number {
  if (offer.discountType === "percentage") {
    return Math.max(0, price * (1 - offer.discountValue / 100));
  }
  return Math.max(0, price - offer.discountValue);
}

export function getBestOfferedPrice(
  price: number,
  productId: Types.ObjectId,
  offers: TOfferLike[],
): number | undefined {
  let best: number | undefined;
  for (const offer of offers) {
    const appliesToAll = offer.applicableProducts.length === 0;
    const applies =
      appliesToAll ||
      offer.applicableProducts.some((id) => id.equals(productId));
    if (applies) {
      const op = computeOfferedPrice(price, offer);
      if (best === undefined || op < best) best = op;
    }
  }
  return best;
}
