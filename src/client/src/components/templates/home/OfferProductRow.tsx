import { ALL_PRODUCTS } from "@/api/clientURL";
import { getAllProductsApi } from "@/api/productApi";
import ProductItem, {
  type PopulatedProduct,
} from "@/components/organisms/user/ProductItem";
import { Button } from "@heroui/react";
import type { TOfferDocument } from "@shared/models/Offer";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

type Props = {
  offer: TOfferDocument;
};

const OfferProductRow: React.FC<Props> = ({ offer }) => {
  const [products, setProducts] = useState<PopulatedProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProductsApi({ offerId: offer._id, inStock: true, limit: 4 }).then(
      (res) => {
        setProducts((res.data.data.products ?? []).slice(0, 4));
      },
    );
  }, [offer._id]);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Offer header banner */}
      <div
        className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary-600 to-secondary-600 p-6 text-white mb-8 cursor-pointer"
        onClick={() => navigate(`${ALL_PRODUCTS}?offerId=${offer._id}`)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {offer.badge}
              </span>
              <p className="text-5xl font-black leading-none mt-3">
                {offer.discountValue}
                <span className="text-3xl">
                  {offer.discountType === "percentage" ? "%" : "৳"}
                </span>
                <span className="text-xl font-semibold ml-2 text-white/80">
                  OFF
                </span>
              </p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/20" />
            <div>
              <h2 className="text-2xl font-black">{offer.title}</h2>
              <p className="text-sm text-white/70 mt-1 max-w-md line-clamp-2">
                {offer.description}
              </p>
            </div>
          </div>

          <Link
            to={`${ALL_PRODUCTS}?offerId=${offer._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="bg-white text-primary font-semibold rounded-full px-6">
              Shop All →
            </Button>
          </Link>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-12 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default OfferProductRow;
