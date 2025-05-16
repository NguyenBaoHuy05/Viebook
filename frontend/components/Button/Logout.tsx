"use client";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import LoadingPage from "../Modal/LoadingPage";

export default function Logout() {
  const { setUserId } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/logout");
      setUserId(null);
      setTimeout(() => {
        router.push("/login");
        toast.success("Đăng xuất thành công!");
      }, 1500);
      setLoading(false);
    } catch (error: any) {
      console.error("Logout error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Đã có lỗi xảy ra khi đăng xuất."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingPage isError={loading} />}
      <div
        onClick={handleLogout}
        className="w-full cursor-pointer text-black hover:text-blue-200 disabled:opacity-50"
      >
        Đăng xuất
      </div>
    </>
  );
}
