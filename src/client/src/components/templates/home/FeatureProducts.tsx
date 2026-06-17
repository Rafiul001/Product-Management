import ProductItem from "@/components/organisms/user/ProductItem";
import { useNewArrivalStore } from "@/store/newArrivalStore";
import { Button } from "@heroui/react";
import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router";

const FeatureProducts: React.FC = () => {
  const { newArrivals, getAllNewArrivals } = useNewArrivalStore();

  useEffect(() => {
    getAllNewArrivals();
  }, [getAllNewArrivals]);

  if (newArrivals.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-primary text-sm font-bold tracking-widest uppercase mb-1">
            Just Arrived
          </p>
          <h2 className="text-3xl font-black text-gray-800">New Arrivals</h2>
        </div>
        <Link to="/all-products">
          <Button variant="ghost" className="border rounded-2xl">
            View All Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {newArrivals.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeatureProducts;
