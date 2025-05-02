"use client";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Ads from "@/components/Auth/Ads";
import HeaderAuth from "@/components/Auth/HeaderAuth";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/forget", { email });
      toast.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
      setEmail("");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Vui lòng kiểm tra lại email!");
      } else if (error.response?.status === 500) {
        toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
      } else {
        toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen items-center flex justify-center bg-gray-100">
      <div className="flex justify-evenly items-center max-w-[1100px] w-full max-h-[650px] shadow-[0px_5px_10px_5px_rgba(173,197,202,0.7)] p-10  bg-gray-100 rounded-xl">
        <Ads />
        <div className=" max-w-md h-fit shadow-[0px_5px_20px_5px_rgba(0,123,255,0.2)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
          <HeaderAuth
            head="Quên mật khẩu"
            subHead1="Hoặc"
            subHead2="đăng nhập lại"
            link1="/login"
          />
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={loading}
                  required
                  className={`
                      rounded-lg relative block w-full px-3 py-3 border 
                      ${errors.email ? "border-red-500" : "border-gray-300"}
                    placeholder-gray-500 text-gray-900 focus:outline-none
                    focus:ring-blue-500 focus:border-blue-500 focus:z-10 
                      sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed
                   `}
                  placeholder="Email"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Gửi email xác thực"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
