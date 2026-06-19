import { Rating } from "@/components/Icons/Ratings";
import { useCartStore } from "@/store/cartStore";
import useUserAuthStore from "@/store/userAuthStore";
import { Card, Spinner } from "@heroui/react";
import React, { useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Link, useNavigate } from "react-router";

export type PopulatedProduct = {
  _id: string;
  productName: string;
  productImage?: string;
  description: string;
  price: number;
  offeredPrice?: number;
  quantity: number;
  stockLimit: number;
  productStatus: boolean;
  rating?: number;
  reviewCount?: number;
  subCategory: {
    _id: string;
    subCategoryName: string;
    status: boolean;
  };
};

const ProductItem: React.FC<{ product: PopulatedProduct }> = ({ product }) => {
  const { addItemToCart } = useCartStore();
  const { isLoggedIn } = useUserAuthStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItemToCart(product._id, 1);
    setIsAdding(false);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/checkout", {
      state: {
        buyNow: {
          productId: product._id,
          quantity: 1,
          unitPrice: product.offeredPrice ?? product.price,
          productName: product.productName,
          productImage: product.productImage,
        },
      },
    });
  };

  const discount = product.offeredPrice
    ? Math.round((1 - product.offeredPrice / product.price) * 100)
    : 0;

  const isOutOfStock = product.quantity <= 0;
  const isLowStock =
    !isOutOfStock && product.quantity <= product.stockLimit * 0.2;
  const displayPrice = (product.offeredPrice ?? product.price).toFixed(2);

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col p-0">
      {/* Discount badge */}
      {discount > 0 && (
        <span className="absolute top-3 right-3 z-10 bg-success-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </span>
      )}

      {/* Image area */}
      <div className="relative flex items-center justify-center bg-white h-44 overflow-hidden">
        {product.productImage ? (
          <img
            src={product.productImage}
            alt={product.productName}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-200 h-36">
            <HiOutlineShoppingCart className="w-16 h-16" />
            <span className="text-xs text-gray-300">No image</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-t-2xl">
            <span className="bg-white border border-danger-200 text-danger-500 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <Card.Content className="flex flex-col items-center justify-between text-center px-3 gap-1 flex-1">
        <Link
          to={`/product/${product._id}`}
          className="font-semibold text-gray-800 hover:text-primary-600 text-xs leading-tight line-clamp-1 w-full transition-colors duration-150"
        >
          {product.productName}
        </Link>

        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-gray-800">
            ৳{displayPrice}
          </span>
          {product.offeredPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stars */}
        {<Rating rating={product.rating ?? 0} className="w-16" />}

        {/* Low stock */}
        {isLowStock && (
          <p className="text-xs text-warning-500 font-medium">
            Only {product.quantity} left
          </p>
        )}
      </Card.Content>

      {/* Action buttons */}
      <div className="flex flex-col border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="py-2.5 flex items-center justify-center gap-1 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-primary-600 font-semibold text-xs transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed border-b border-gray-100"
        >
          {isAdding ? (
            <Spinner size="sm" />
          ) : (
            <>
              <HiOutlineShoppingCart className="w-3.5 h-3.5" />
              {isOutOfStock ? "Unavailable" : "Add to Cart"}
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-xs transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Unavailable" : "Buy Now"}
        </button>
      </div>
    </Card>
  );
};

export default ProductItem;
