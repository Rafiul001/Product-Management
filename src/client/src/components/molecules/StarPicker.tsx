import type React from "react";
import { FaStar } from "react-icons/fa";

type Props = {
  value: number;
  onChange: (v: number) => void;
};

const StarPicker: React.FC<Props> = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="focus:outline-none"
      >
        <FaStar
          className={`w-7 h-7 transition-colors ${star <= value ? "text-warning-400" : "text-gray-300"}`}
        />
      </button>
    ))}
  </div>
);

export default StarPicker;
