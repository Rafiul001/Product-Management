import Banner from "@/components/templates/home/Banner";
import FeatureProducts from "@/components/templates/home/FeatureProducts";
import OffersSection from "@/components/templates/home/OffersSection";
import type React from "react";

const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <OffersSection />
      <FeatureProducts />
    </div>
  );
};

export default Home;
