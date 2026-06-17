import { HOME } from "@/api/clientURL";
import AdminWrapper from "@/layout/AdminWrapper";
import DashboardLayout from "@/layout/DashboardLayout";
import RootLayout from "@/layout/RootLayout";
import Banners from "@/pages/dashboard/Banners";
import Categories from "@/pages/dashboard/Categories";
import Dashboard from "@/pages/dashboard/Dashboard";
import Login from "@/pages/dashboard/Login";
import Offers from "@/pages/dashboard/Offers";
import Orders from "@/pages/dashboard/Orders";
import Products from "@/pages/dashboard/Products";
import StockEntries from "@/pages/dashboard/StockEntries";
import SubCategories from "@/pages/dashboard/SubCategories";
import Users from "@/pages/dashboard/Users";
import AllProducts from "@/pages/user/AllProducts";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import UserDashboard from "@/pages/user/Dashboard";
import Home from "@/pages/user/Home";
import OrderSuccess from "@/pages/user/OrderSuccess";
import PaymentFailed from "@/pages/user/PaymentFailed";
import Register from "@/pages/user/Register";
import UserLogin from "@/pages/user/UserLogin";
import VerifyEmail from "@/pages/user/VerifyEmail";
import ViewProduct from "@/pages/user/ViewProduct";
import useUserAuthStore from "@/store/userAuthStore";
import { ToastProvider } from "@heroui/react";
import type React from "react";
import { useEffect } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: HOME,
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all-products",
        Component: AllProducts,
      },
      {
        path: "product/:id",
        Component: ViewProduct,
      },
      {
        path: "cart",
        Component: Cart,
      },
      {
        path: "checkout",
        Component: Checkout,
      },
      {
        path: "dashboard",
        Component: UserDashboard,
      },
      {
        path: "order-success",
        Component: OrderSuccess,
      },
      {
        path: "payment-failed",
        Component: PaymentFailed,
      },
    ],
  },
  { path: "/login", Component: UserLogin },
  { path: "/register", Component: Register },
  { path: "/verify-email", Component: VerifyEmail },
  {
    path: "/admin",
    Component: AdminWrapper,
    children: [
      {
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: "products",
            Component: Products,
          },
          {
            path: "categories",
            Component: Categories,
          },
          {
            path: "sub-categories",
            Component: SubCategories,
          },
          {
            path: "stock-entries",
            Component: StockEntries,
          },
          {
            path: "banners",
            Component: Banners,
          },
          {
            path: "offers",
            Component: Offers,
          },
          {
            path: "orders",
            Component: Orders,
          },
          {
            path: "users",
            Component: Users,
          },
        ],
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
]);

const App: React.FC = () => {
  const getInfo = useUserAuthStore((s) => s.getInfo);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  return (
    <>
      <ToastProvider placement="top end" className="z-9999" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
