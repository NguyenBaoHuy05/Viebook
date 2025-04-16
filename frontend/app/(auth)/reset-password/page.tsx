"use client";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(0);

  useEffect(() => {
    if (token && email) {
      axios
        .get(`/api/reset?token=${token}&email=${email}`)
        .then((response) => {
          setIsTokenValid(1);
          toast.success(response.data.message);
        })
        .catch((error) => {
          setIsTokenValid(2);
          setErrors(error.response?.data?.errors || {});
          toast.error(
            error.response?.data?.message || "Liên kết không hợp lệ!"
          );
        });
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/reset", {
        token,
        email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
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

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Liên kết không hợp lệ. Vui lòng thử lại.</p>
      </div>
    );
  }

  if (isTokenValid === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (isTokenValid === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">
          Liên kết không hợp lệ hoặc đã hết hạn.{" "}
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Thử lại
          </Link>
        </p>
      </div>
    );
  }

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
        <div className=" max-w-md h-fit shadow-[0px_5px_20px_5px_rgba(0,123,255,0.2)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
          <div className="text-center">
            <FaFacebook size={50} className="mx-auto text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Thay đổi mật khẩu
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                đăng nhập lại
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
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
                  placeholder="Mật khẩu mới"
                  value={formData.password}
                  onChange={handleChange}
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
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
