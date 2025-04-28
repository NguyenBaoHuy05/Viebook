"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosConfig";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId, setUserId } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUserId = localStorage.getItem("userId");

    if (!token) {
      router.push("/login");
      return;
    }

    // Nếu localStorage đã có userId → dùng luôn
    if (localUserId) {
      setUserId(localUserId);
      console.log("User ID từ localStorage:", userId);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(res.data.id);
        localStorage.setItem("userId", res.data.id);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, setUserId]);

  if (loading || !userId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
