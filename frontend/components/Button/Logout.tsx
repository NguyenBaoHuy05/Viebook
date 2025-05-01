"use client";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function Logout() {
  const { setUserId } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      toast.loading("Đang đăng xuất");
      await axios.post("/api/logout");
      toast.dismiss();
      setUserId(null);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      toast.success("Đăng xuất thành công!");
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
    <div
      onClick={handleLogout}
      className="cursor-pointer text-black hover:text-blue-200 disabled:opacity-50"
    >
      Đăng xuất
    </div>
  );
}
