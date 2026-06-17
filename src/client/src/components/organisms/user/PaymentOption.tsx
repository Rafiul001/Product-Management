import type { TPaymentMethod } from "@shared/constants/order/index";
import type React from "react";

type Props = {
  value: TPaymentMethod;
  selected: TPaymentMethod;
  onChange: (v: TPaymentMethod) => void;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const PaymentOption: React.FC<Props> = ({
  value,
  selected,
  onChange,
  label,
  description,
  icon,
}) => (
  <label
    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
      selected === value
        ? "border-primary-500 bg-primary-50"
        : "border-gray-100 hover:border-gray-200"
    }`}
  >
    <input
      type="radio"
      name="paymentMethod"
      value={value}
      checked={selected === value}
      onChange={() => onChange(value)}
      className="mt-1 accent-primary-500"
    />
    <div className="flex items-start gap-3 flex-1">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  </label>
);

export default PaymentOption;
