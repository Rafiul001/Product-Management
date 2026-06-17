import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type React from "react";
import { Outlet } from "react-router";

const RootLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
