import {
  placeDirectOrderApi,
  placeDirectOrderViaFormPost,
  placeOrderFromCartApi,
  placeOrderViaFormPost,
} from "@/api/orderApi";
import { getUserProfile } from "@/api/userApi";
import EmptyState from "@/components/molecules/EmptyState";
import ProductImage from "@/components/molecules/ProductImage";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import OrderSuccessView, {
  type TOrderResult,
} from "@/components/organisms/user/OrderSuccessView";
import PaymentOption from "@/components/organisms/user/PaymentOption";
import { useCartStore } from "@/store/cartStore";
import useUserAuthStore from "@/store/userAuthStore";
import { Button, Spinner } from "@heroui/react";
import type { TPaymentMethod } from "@shared/constants/order/index";
import { PAYMENT_METHOD } from "@shared/constants/order/index";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {
  HiChevronLeft,
  HiOutlineCash,
  HiOutlineDeviceMobile,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router";

type TAddressFields = {
  street: string;
  area: string;
  city: string;
  postalCode: string;
};

const parseAddress = (raw: string): TAddressFields => {
  if (raw.includes("\n")) {
    const [street = "", area = "", city = "", postalCode = ""] =
      raw.split("\n");
    return { street, area, city, postalCode };
  }
  const [main = "", postalCode = ""] = raw.split(" - ");
  const parts = main.split(", ");
  return {
    street: parts[0] ?? "",
    area: parts[1] ?? "",
    city: parts[2] ?? "",
    postalCode,
  };
};

const composeAddress = (f: TAddressFields) =>
  `${f.street.trim()}\n${f.area.trim()}\n${f.city.trim()}\n${f.postalCode.trim()}`;

type TBuyNowState = {
  productId: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  productImage?: string;
};

const Checkout: React.FC = () => {
  const { cart, cartLoading, getCart } = useCartStore();
  const { isLoggedIn } = useUserAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNow =
    (location.state as { buyNow?: TBuyNowState } | null)?.buyNow ?? null;

  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>(
    PAYMENT_METHOD.CASH_ON_DELIVERY,
  );
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TOrderResult | null>(null);
  const [addressFields, setAddressFields] = useState<TAddressFields>({
    street: "",
    area: "",
    city: "",
    postalCode: "",
  });
  const [editingAddress, setEditingAddress] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!buyNow) getCart();
    getUserProfile().then((res) => {
      if (res.data?.data?.address) {
        setAddressFields(parseAddress(res.data.data.address));
      }
    });
  }, [isLoggedIn, getCart, navigate, buyNow]);

  const buyNowTotal = buyNow ? buyNow.unitPrice * buyNow.quantity : 0;
  const cartTotalQty = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const totalQty = buyNow ? buyNow.quantity : cartTotalQty;

  const handlePlaceOrder = async () => {
    setError(null);
    const deliveryAddress = composeAddress(addressFields);

    if (buyNow) {
      if (paymentMethod === PAYMENT_METHOD.ONLINE_MOBILE_BANKING) {
        placeDirectOrderViaFormPost(
          buyNow.productId,
          buyNow.quantity,
          paymentMethod,
          deliveryAddress,
        );
        return;
      }
      setPlacing(true);
      try {
        const response = await placeDirectOrderApi(
          buyNow.productId,
          buyNow.quantity,
          paymentMethod,
          deliveryAddress,
        );
        setResult(response.data.data);
      } catch (err) {
        if (isAxiosError<{ message: string }>(err)) {
          setError(err.response?.data.message ?? "Failed to place order");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setPlacing(false);
      }
      return;
    }

    if (!cart || cart.items.length === 0) return;

    if (paymentMethod === PAYMENT_METHOD.ONLINE_MOBILE_BANKING) {
      placeOrderViaFormPost(paymentMethod, deliveryAddress);
      return;
    }

    setPlacing(true);
    try {
      const response = await placeOrderFromCartApi(
        paymentMethod,
        deliveryAddress,
      );
      setResult(response.data.data);
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        setError(err.response?.data.message ?? "Failed to place order");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setPlacing(false);
    }
  };

  if (!buyNow && cartLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (result) return <OrderSuccessView result={result} />;

  if (!buyNow && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          icon={<HiOutlineShoppingCart className="w-10 h-10 text-gray-400" />}
          title="Nothing to checkout"
          description="Your cart is empty. Add items before checking out."
          action={
            <Link
              to="/cart"
              className="mt-2 px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              Back to Cart
            </Link>
          }
        />
      </div>
    );
  }

  const displayTotal = buyNow ? buyNowTotal : (cart?.totalPrice ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to={buyNow ? (-1 as unknown as string) : "/cart"}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title={buyNow ? "Back to product" : "Back to cart"}
        >
          <HiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900 text-base mb-4">
              Order Items
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({totalQty} {totalQty === 1 ? "item" : "items"})
              </span>
            </h2>
            <div className="divide-y divide-gray-50">
              {buyNow ? (
                <div className="flex items-center gap-4 py-3">
                  <div className="shrink-0 w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <ProductImage
                      src={buyNow.productImage}
                      alt={buyNow.productName}
                      imgClassName="w-full h-full object-contain p-1"
                      placeholderClassName="w-6 h-6 text-gray-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {buyNow.productName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ৳{buyNow.unitPrice.toFixed(2)} × {buyNow.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">
                    ৳{buyNowTotal.toFixed(2)}
                  </p>
                </div>
              ) : (
                cart!.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="shrink-0 w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                      <ProductImage
                        src={item.product.productImage}
                        alt={item.product.productName}
                        imgClassName="w-full h-full object-contain p-1"
                        placeholderClassName="w-6 h-6 text-gray-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.product.productName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ৳{item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 shrink-0">
                      ৳{(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-base">
                Delivery Address
              </h2>
              {!editingAddress && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Change
                </button>
              )}
            </div>

            {editingAddress ? (
              <div className="flex flex-col gap-3">
                <UITextInput
                  label="Street / Road"
                  placeholder="House no., road name"
                  value={addressFields.street}
                  onChange={(e) =>
                    setAddressFields((f) => ({ ...f, street: e.target.value }))
                  }
                />
                <UITextInput
                  label="Area / Thana"
                  placeholder="Area or thana"
                  value={addressFields.area}
                  onChange={(e) =>
                    setAddressFields((f) => ({ ...f, area: e.target.value }))
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <UITextInput
                    label="City / District"
                    placeholder="Dhaka"
                    value={addressFields.city}
                    onChange={(e) =>
                      setAddressFields((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                  <UITextInput
                    label="Postal Code"
                    placeholder="1200"
                    value={addressFields.postalCode}
                    onChange={(e) =>
                      setAddressFields((f) => ({
                        ...f,
                        postalCode: e.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  onClick={() => setEditingAddress(false)}
                  className="self-start text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Street / Road", value: addressFields.street },
                  { label: "Area / Thana", value: addressFields.area },
                  { label: "City / District", value: addressFields.city },
                  { label: "Postal Code", value: addressFields.postalCode },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-medium text-gray-800">{value || "—"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
            <h2 className="font-bold text-gray-900 text-base mb-4">
              Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              <PaymentOption
                value={PAYMENT_METHOD.CASH_ON_DELIVERY}
                selected={paymentMethod}
                onChange={setPaymentMethod}
                label="Cash on Delivery"
                description="Pay when your order arrives at your doorstep."
                icon={<HiOutlineCash className="w-5 h-5" />}
              />
              <PaymentOption
                value={PAYMENT_METHOD.ONLINE_MOBILE_BANKING}
                selected={paymentMethod}
                onChange={setPaymentMethod}
                label="Online / Mobile Banking"
                description="Pay securely via SSLCommerz — bKash, Nagad, cards & more."
                icon={<HiOutlineDeviceMobile className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>
                  Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
                </span>
                <span className="font-medium text-gray-800">
                  ৳{displayTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-success-600 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-lg">৳{displayTotal.toFixed(2)}</span>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-danger-50 border border-danger-100 rounded-xl text-danger-600 text-xs">
                {error}
              </div>
            )}

            <Button
              onPress={handlePlaceOrder}
              isDisabled={placing}
              className="w-full py-3 font-semibold"
              variant="primary"
              size="lg"
            >
              {placing ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Placing Order…
                </span>
              ) : (
                "Place Order"
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 mt-3">
              By placing this order you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
