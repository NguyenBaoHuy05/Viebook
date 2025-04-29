"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/logout");
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
      localStorage.removeItem("userId");
      localStorage.removeItem("auth_token");
      toast.success("Đăng xuất thành công!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra khi đăng xuất.";
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
      className="border-hidden text-black hover:text-blue-200 disabled:opacity-50"
    >
      {loading ? "Đang xử lý..." : "Đăng xuất"}
    </div>
  );
}
