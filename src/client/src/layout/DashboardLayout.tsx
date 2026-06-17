import TopBar from "@/components/organisms/dashboard/TopBar";
import Sidebar from "@/pages/dashboard/Sidebar";
import useAdminAuthStore from "@/store/adminAuthStore";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { useAdminUserStore } from "@/store/adminUserStore";
import { useBannerStore } from "@/store/bannerStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { useStockEntryStore } from "@/store/stockEntryStore";
import { useSubCategoryStore } from "@/store/subCategoryStore";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

const DashboardLayout: React.FC = () => {
  const [isCollapse, setIsCollapse] = useState<boolean>(true);
  const { isLoggedIn } = useAdminAuthStore();
  const { getAllCategories } = useCategoryStore();
  const { getAllSubCategories } = useSubCategoryStore();
  const { getAllProductsAdmin } = useProductStore();
  const { getAllStockEntries } = useStockEntryStore();
  const { getAllBanners } = useBannerStore();
  const { fetchAllOrders } = useAdminOrderStore();
  const { fetchAllUsers } = useAdminUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      setIsCollapse(!media.matches);
    };
    handler();
    media.addEventListener("change", handler);
    return () => {
      media.removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    getAllCategories();
    getAllSubCategories();
    getAllProductsAdmin();
    getAllStockEntries();
    getAllBanners();
    fetchAllOrders();
    fetchAllUsers();
  }, [
    getAllCategories,
    getAllProductsAdmin,
    getAllSubCategories,
    getAllStockEntries,
    getAllBanners,
    fetchAllOrders,
    fetchAllUsers,
  ]);

  return (
    <div className="flex w-screen h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isCollapse={isCollapse}
        onToggle={() => setIsCollapse((s) => !s)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
