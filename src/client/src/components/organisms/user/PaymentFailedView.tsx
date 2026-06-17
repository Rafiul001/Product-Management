import type React from "react";
import { HiX } from "react-icons/hi";
import { Link } from "react-router";

const PaymentFailedView: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
      <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
        <HiX className="w-8 h-8 text-danger-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
      <p className="text-gray-500 text-sm mb-8">
        Your payment could not be processed. No charges were made. Please try
        again or use a different payment method.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          to="/checkout"
          className="inline-block w-full py-3 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors text-center"
        >
          Try Again
        </Link>
        <Link
          to="/"
          className="inline-block w-full py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default PaymentFailedView;
