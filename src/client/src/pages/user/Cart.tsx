import EmptyState from "@/components/molecules/EmptyState";
import CartItem from "@/components/organisms/user/CartItem";
import { useCartStore } from "@/store/cartStore";
import { Button, Spinner } from "@heroui/react";
import type React from "react";
import { useEffect, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Link } from "react-router";

const Cart: React.FC = () => {
  const { cart, cartLoading, getCart, removeItemFromCart, deleteCart } =
    useCartStore();
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    void getCart();
  }, [getCart]);

  const handleClearCart = async () => {
    setClearing(true);
    await deleteCart();
    setClearing(false);
  };

  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          icon={<HiOutlineShoppingCart className="w-10 h-10 text-gray-400" />}
          title="Your cart is empty"
          description="Add some products to get started."
          action={
            <Link
              to="/all-products"
              className="mt-2 px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  const totalQty = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart
          <span className="ml-2 text-base font-normal text-gray-400">
            ({totalQty} {totalQty === 1 ? "item" : "items"})
          </span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onPress={handleClearCart}
          isDisabled={clearing}
          className="text-danger-500 hover:text-danger-600"
        >
          {clearing ? "Clearing…" : "Clear Cart"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-2">
          {cart.items.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onRemove={removeItemFromCart}
            />
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalQty} items)</span>
                <span className="font-medium text-gray-800">
                  ৳{cart.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-success-600 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-lg">৳{cart.totalPrice.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
