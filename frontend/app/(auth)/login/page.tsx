"use client";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/login", formData);
      // Lưu token vào cookie
      const { token } = response.data;
      localStorage.setItem("token", token);
      const maxAge = formData.remember ? 30 * 24 * 60 * 60 : 60 * 60; // 30 ngày hoặc 1 giờ
      const isProduction = process.env.NODE_ENV === "production";
      document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict${
        isProduction ? "; Secure" : ""
      }`;

      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Vui lòng kiểm tra lại thông tin đăng nhập");
      } else if (error.response?.status === 401) {
        toast.error("Thông tin đăng nhập không chính xác!");
      } else if (error.response?.status === 403) {
        toast.error("Vui lòng xác minh email trước khi đăng nhập!");
        setTimeout(() => {
          router.push("/verify-email-resend");
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className=" min-h-screen items-center flex justify-center bg-gray-100">
      <div className="flex justify-evenly items-center max-w-[1100px] w-full max-h-[650px] shadow-[0px_5px_10px_5px_rgba(173,197,202,0.7)] p-10  bg-gray-100 rounded-xl">
        <div className="flex flex-col items-center justify-around max-w-md">
          <img className="max-w-sm p-5" src="/landing.jpg" alt="" />
          <h3 className="font-medium text-blue-600 hover:text-blue-500 text-center">
            Vì một mạng xã hội Việt Nam an toàn , lành mạnh. Viebook sẽ là nơi
            lan tỏa yêu thương đến với mọi người!
          </h3>
        </div>
        <div className="max-w-md shadow-[0_0_10px_10px_rgba(110,219,246,0.5)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
          <div className="text-center">
            <FaFacebook size={50} className="mx-auto text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Đăng nhập vào Viebook
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                tạo tài khoản mới
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
                  className={`
                      rounded-lg relative block w-full px-3 py-3 border 
                      ${errors.email ? "border-red-500" : "border-gray-300"}
                    placeholder-gray-500 text-gray-900 focus:outline-none
                    focus:ring-blue-500 focus:border-blue-500 focus:z-10 
                      sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed
                   `}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  disabled={loading}
                  required
                  className={`rounded-lg relative block w-full px-3 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChecked}
                  className="h-4 w-4 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forget-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Quên mật khẩu?
                </Link>
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
                  "Đăng nhập"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
