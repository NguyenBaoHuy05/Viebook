"use client";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Ads from "@/components/Auth/Ads";
import HeaderAuth from "@/components/Auth/HeaderAuth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      console.log({ email, token, password, password_confirmation });
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/reset", {
        token,
        email,
        password,
        password_confirmation,
      });
      toast.success("Đổi mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Vui lòng kiểm tra lại!");
      } else if (error.response?.status === 500) {
        toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
      } else {
        console.error("Reset failed:", error.response?.data || error.message);
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Liên kết không hợp lệ. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen items-center flex justify-center bg-gray-100">
      <div className="flex justify-evenly items-center max-w-[1100px] w-full max-h-[650px] shadow-[0px_5px_10px_5px_rgba(173,197,202,0.7)] p-10  bg-gray-100 rounded-xl">
        <Ads />
        <div className=" max-w-md h-fit shadow-[0px_5px_20px_5px_rgba(0,123,255,0.2)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
          <HeaderAuth
            head="Thay đổi mật khẩu"
            subHead1="Hoặc"
            subHead2="đăng nhập lại"
            link1="/login"
          />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  disabled={loading}
                  required
                  className={`rounded-lg relative block w-full px-3 py-3 border  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  disabled={loading}
                  required
                  className={`rounded-lg relative block w-full px-3 py-3 border ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Nhập lại mật khẩu"
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Cập nhập mật khẩu"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
