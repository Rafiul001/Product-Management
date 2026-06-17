import StarIcon from "@/components/Icons/StarIcon";
import React from "react";

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= Math.floor(rating)} />
      ))}
    </div>
  );
};

export default Stars;
