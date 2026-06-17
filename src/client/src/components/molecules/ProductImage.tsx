import type React from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";

type Props = {
  src?: string;
  alt?: string;
  imgClassName?: string;
  placeholderClassName?: string;
};

const ProductImage: React.FC<Props> = ({
  src,
  alt = "Product",
  imgClassName = "w-full h-full object-contain p-2",
  placeholderClassName = "w-8 h-8 text-gray-300",
}) => {
  if (src) {
    return <img src={src} alt={alt} className={imgClassName} />;
  }
  return <HiOutlineShoppingCart className={placeholderClassName} />;
};

export default ProductImage;
