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
  const { userId, setUserId, username, setUsername } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user");
        setUserId(res.data.user.id);
        setUsername(res.data.user.username);
        console.log("Kết quả context: ", res.data.user.id);
        console.log("Kết quả context: ", res.data.user.username);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, setUserId]);

  if (loading) {
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
