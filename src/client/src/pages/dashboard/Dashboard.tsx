import StatCard from "@/components/organisms/dashboard/StatCard";
import useAdminAuthStore from "@/store/adminAuthStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { useStockEntryStore } from "@/store/stockEntryStore";
import { useSubCategoryStore } from "@/store/subCategoryStore";
import { Chip } from "@heroui/react";
import { motion } from "motion/react";
import type React from "react";
import {
  FaLayerGroup,
  FaProductHunt,
  FaSitemap,
  FaUserCircle,
} from "react-icons/fa";
import { MdInventory2 } from "react-icons/md";

const Dashboard: React.FC = () => {
  const { admin } = useAdminAuthStore();
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { products } = useProductStore();
  const { stockEntries } = useStockEntryStore();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back,{" "}
          <span className="text-primary-600">{admin?.adminUserName}</span>!
        </h1>
        <p className="text-sm text-gray-500 mt-1">{today}</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Categories"
          value={categories.length}
          icon={<FaLayerGroup />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          delay={0}
        />
        <StatCard
          label="Sub Categories"
          value={subCategories.length}
          icon={<FaSitemap />}
          iconBg="bg-secondary-50"
          iconColor="text-secondary-600"
          delay={0.08}
        />
        <StatCard
          label="Total Products"
          value={products.length}
          icon={<FaProductHunt />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          delay={0.16}
        />
        <StatCard
          label="Stock Entries"
          value={stockEntries.length}
          icon={<MdInventory2 />}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
          delay={0.24}
        />
      </div>

      {/* Admin Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-sm"
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Admin Profile
        </p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
            <FaUserCircle className="text-primary-500 text-3xl" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-base leading-tight truncate">
              {admin?.adminUserName}
            </p>
            <p className="text-gray-500 text-sm mt-0.5 truncate">
              {admin?.adminEmail}
            </p>
            <Chip
              size="sm"
              color="accent"
              variant="soft"
              className="mt-2 capitalize"
            >
              {admin?.adminType}
            </Chip>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
