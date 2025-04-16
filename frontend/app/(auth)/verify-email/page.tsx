"use client";
import { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import axios from "@/lib/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const encodedUrl = searchParams.get("url");
        if (!encodedUrl) {
          setError("Liên kết không hợp lệ. Vui lòng đăng ký lại.");
          toast.error("Liên kết không hợp lệ!");
          return;
        }

        // Giải mã URL
        const decodedUrl = decodeURIComponent(encodedUrl);
        console.log("Decoded URL:", decodedUrl); // Debug

        // Phân tích URL để lấy id và hash
        const urlObj = new URL(decodedUrl);
        const id = urlObj.searchParams.get("id");
        const hash = urlObj.searchParams.get("hash");

        if (!id || !hash) {
          setError("Liên kết không hợp lệ. Vui lòng đăng ký lại.");
          toast.error("Liên kết không hợp lệ!");
          return;
        }

        console.log("Sending to backend:", { id, hash }); // Debug

        setLoading(true);
        const response = await axios.post("/api/verify-email", { id, hash });

        toast.success(response.data.message);
        setVerified(true);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra!";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Verification error:", err.response?.data); // Debug
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (error && !loading && !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">
          {error}{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Đăng ký lại
          </Link>
          .
        </p>
      </div>
    );
  }

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
              Xác Minh Email
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
          <div className="text-center">
            {loading && (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                <span className="ml-2">Đang xác minh...</span>
              </div>
            )}
            {verified && (
              <p className="text-green-500">
                Xác minh thành công! Đang chuyển hướng...
              </p>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
