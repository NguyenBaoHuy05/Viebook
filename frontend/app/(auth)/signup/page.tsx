"use client";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      toast.success("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Vui lòng kiểm tra lại thông tin đăng ký");
      } else {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-blue-900">
      <div className="max-w-md shadow-[0_0_10px_10px_rgba(110,219,246,0.5)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
        <div className="text-center">
          <FaFacebook size={50} className="mx-auto text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Tạo tài khoản Viebook
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                className={`rounded-lg relative block w-full px-3 py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                className={`rounded-lg relative block w-full px-3 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                className={`rounded-lg relative block w-full px-3 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password[0]}
                </p>
              )}
            </div>
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={loading}
                className={`rounded-lg relative block w-full px-3 py-3 border ${
                  errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirmation[0]}
                </p>
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
                "Đăng ký"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
