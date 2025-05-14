"use client";
import React, { useEffect, useState } from "react";
import AdminOverview from "@/components/Admin/Overview";
import LoadingPage from "@/components/Modal/LoadingPage";
import statProp from "@/interface/statType";
import { useUser } from "@/context/UserContext";
import axios from "@/lib/axiosConfig";

function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const { userId } = useUser();
  const [stat, setStat] = useState<{ result: statProp } | undefined>(undefined);
  useEffect(() => {
    const handleStat = async () => {
      try {
        const res = await axios.get("/api/admin/statisticsOverview");
        setStat(res.data);
        setLoading(false);
      } catch (error) {
        console.log("Lỗi: ", error);
        setLoading(false);
      }
    };
    handleStat();
  }, [userId]);
  return (
    <>
      {loading && <LoadingPage isError={loading} />}
      {stat && <AdminOverview stats={stat} />}
    </>
  );
}

export default AdminDashboard;
