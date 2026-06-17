import OrdersTab from "@/components/organisms/user/OrdersTab";
import ProfileTab from "@/components/organisms/user/ProfileTab";
import useUserAuthStore from "@/store/userAuthStore";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type TTab = "orders" | "profile";

const TAB_LIST: { key: TTab; label: string }[] = [
  { key: "orders", label: "My Orders" },
  { key: "profile", label: "Profile & Address" },
];

const Dashboard: React.FC = () => {
  const { isLoggedIn, authInitialized, user } = useUserAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TTab>("orders");

  useEffect(() => {
    if (authInitialized && !isLoggedIn) navigate("/login");
  }, [authInitialized, isLoggedIn, navigate]);

  if (!authInitialized) return null;
  if (!isLoggedIn) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back,{" "}
          <span className="font-medium text-gray-700">{user.userName}</span>
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
        {TAB_LIST.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "orders" && <OrdersTab />}
      {activeTab === "profile" && <ProfileTab />}
    </div>
  );
};

export default Dashboard;
