import useAdminAuthStore from "@/store/adminAuthStore";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";

const AdminWrapper: React.FC = () => {
  const { getInfo } = useAdminAuthStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAdminInformation = async () => {
      await getInfo();
      setLoading(false);
    };
    getAdminInformation();
  }, [getInfo]);

  if (loading) return;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminWrapper;
