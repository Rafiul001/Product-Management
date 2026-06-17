import type React from "react";
import { FaSpinner } from "react-icons/fa";

type Props = {
  loading: boolean;
  loadingText: string;
  icon: React.ReactNode;
  label: string;
};

const AuthSubmitButton: React.FC<Props> = ({
  loading,
  loadingText,
  icon,
  label,
}) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
      loading
        ? "bg-primary/60 cursor-not-allowed"
        : "bg-primary hover:bg-primary/90"
    }`}
  >
    {loading ? (
      <>
        <FaSpinner className="animate-spin h-5 w-5 mr-2" />
        {loadingText}
      </>
    ) : (
      <>
        {icon}
        {label}
      </>
    )}
  </button>
);

export default AuthSubmitButton;
