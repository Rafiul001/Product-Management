import CartIcon from "@/components/Icons/CartIcon";
import HeartIcon from "@/components/Icons/HeartIcon";
import Stars from "@/components/Icons/Stars";
import { Button, Card, CardHeader } from "@heroui/react";
import type React from "react";
import { useState } from "react";

const ProductCard: React.FC<{
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    badge: string | null;
    color: string;
  };
}> = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const discount = Math.round(
    (1 - product.price / product.originalPrice) * 100,
  );

  return (
    <Card>
      {/* Image area */}
      <CardHeader
        className="relative h-52 flex items-center justify-center p-6"
        style={{ backgroundColor: product.color }}
      >
        <Button
          isIconOnly
          onPress={() => setLiked(!liked)}
          className="absolute top-3 right-3 p-2 rounded-full"
          variant={liked ? "danger" : "ghost"}
        >
          <HeartIcon />
        </Button>
        {/* Placeholder product image */}
        <div className="w-28 h-28 rounded-xl bg-white/60 flex items-center justify-center shadow-inner">
          <span className="text-4xl">🛍️</span>
        </div>
      </CardHeader>

      {/* Info */}
      <Card.Content className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ${product.originalPrice}
            </span>
            <span className="text-xs text-success-600 font-medium">
              -{discount}%
            </span>
          </div>
          <Button variant="primary" isIconOnly>
            <CartIcon />
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
