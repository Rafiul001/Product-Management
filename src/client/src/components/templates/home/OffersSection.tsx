import { useOfferStore } from "@/store/offerStore";
import type React from "react";
import { useEffect } from "react";
import OfferProductRow from "./OfferProductRow";

const OffersSection: React.FC = () => {
  const { activeOffers, getActiveOffers } = useOfferStore();

  useEffect(() => {
    getActiveOffers();
  }, [getActiveOffers]);

  if (activeOffers.length === 0) return null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <p className="text-primary text-sm font-bold tracking-widest uppercase mb-1">
          Limited Time
        </p>
        <h2 className="text-3xl font-black text-gray-800">Deals & Offers</h2>
      </div>

      {activeOffers.map((offer) => (
        <OfferProductRow key={offer._id} offer={offer} />
      ))}
    </div>
  );
};

export default OffersSection;
