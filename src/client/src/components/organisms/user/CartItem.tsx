import ProductImage from "@/components/molecules/ProductImage";
import { type TCartItemPopulated } from "@/store/cartStore";
import { Spinner } from "@heroui/react";
import type React from "react";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { Link } from "react-router";

type Props = {
  item: TCartItemPopulated;
  onRemove: (productId: string) => Promise<void>;
};

const CartItem: React.FC<Props> = ({ item, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.product._id);
    setRemoving(false);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="shrink-0 w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
        <ProductImage
          src={item.product.productImage}
          alt={item.product.productName}
          imgClassName="w-full h-full object-contain p-2"
          placeholderClassName="w-8 h-8 text-gray-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.product._id}`}
          className="font-semibold text-gray-800 hover:text-primary-600 transition-colors text-sm leading-tight line-clamp-2"
        >
          {item.product.productName}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-gray-900">
            ৳{item.unitPrice.toFixed(2)}
          </span>
          {item.unitPrice < item.product.price && (
            <span className="text-xs text-gray-400 line-through">
              ৳{item.product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-500">Qty</span>
        <span className="w-8 text-center font-semibold text-gray-800 text-sm">
          {item.quantity}
        </span>
      </div>

      <div className="text-right shrink-0 w-24">
        <p className="font-bold text-gray-900 text-sm">
          ৳{(item.unitPrice * item.quantity).toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleRemove}
        disabled={removing}
        className="shrink-0 p-2 text-gray-400 hover:text-danger-500 transition-colors disabled:opacity-50"
        title="Remove item"
      >
        {removing ? <Spinner size="sm" /> : <HiX className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default CartItem;
