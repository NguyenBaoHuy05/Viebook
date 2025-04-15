"use client";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className=" max-w-md h-fit shadow-[0px_5px_20px_5px_rgba(0,123,255,0.2)] w-full space-y-8 p-8 bg-gray-100 rounded-xl">
          <div className="text-center">
            <FaFacebook size={50} className="mx-auto text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Quên mật khẩu
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
                  required
                  className="rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Gửi email xác thực
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
