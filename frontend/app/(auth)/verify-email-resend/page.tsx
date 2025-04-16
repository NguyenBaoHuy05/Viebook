"use client";
import { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyEmailResendPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
      await axios.post("/api/resend-verification", { email });
      toast.success("Email xác minh đã được gửi lại!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Vui lòng kiểm tra lại email!");
      } else {
        toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen items-center flex justify-center bg-gray-100">
      <div className="flex justify-evenly items-center max-w-[1100px] w-full max-h-[650px] shadow-[0px_5px_10px_5px_rgba(173,197,202,0.7)] p-10 bg-gray-100 rounded-xl">
        <div className="flex flex-col items-center justify-around max-w-md">
          <img className="max-w-sm p-5" src="/landing.jpg" alt="Viebook" />
          <h3 className="font-medium text-blue-600 hover:text-blue-500 text-center">
            Vì một mạng xã hội Việt Nam an toàn, lành mạnh. Viebook sẽ là nơi
            lan tỏa yêu thương đến với mọi người!
          </h3>
        </div>
        <div className="max-w-md h-fit shadow-[0px_5px_20px_5px_rgba(0,123,255,0.2)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
          <div className="text-center">
            <FaFacebook size={50} className="mx-auto text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Gửi Lại Email Xác Minh
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                đăng nhập
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={loading}
                  required
                  className={`rounded-lg relative block w-full px-3 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Email"
                  value={email}
                  onChange={handleEmail}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                )}
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
                  "Gửi lại email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
