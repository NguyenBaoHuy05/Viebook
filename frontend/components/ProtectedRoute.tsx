"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withXSRFToken = true;

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => setLoading(false))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

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
}
