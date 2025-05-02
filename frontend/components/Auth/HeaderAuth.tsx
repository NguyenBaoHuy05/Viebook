import React from "react";
import Link from "next/link";

interface HeaderAuthProps {
  head: string;
  subHead1: string;
  subHead2: string;
  link1: string;
}

const HeaderAuth: React.FC<HeaderAuthProps> = ({
  head,
  subHead1,
  subHead2,
  link1,
}) => {
  return (
    <>
      <div className="text-center">
        <svg
          width="50"
          height="50"
          viewBox="0 0 64 64" // Giữ nguyên viewBox, nội dung bên trong sẽ co giãn để khớp với 50x50
          xmlns="http://www.w3.org/2000/svg"
          className="block mx-auto cursor-pointer transition-transform hover:scale-100 rounded-full"
        >
          <circle cx="32" cy="32" r="32" fill="black" />

          <path
            d="M20 24 L32 40 L44 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 15 q2 5 6 0 q2 -4 4 0"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M50 15 q3 5 6 0 q3 -5 6 0"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15 50 q2 3 4 0 q2 -3 4 0"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M40 45 q3 3 4 0 q3 -5 6 0"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <h2 className="mt-6 text-3xl font-bold text-gray-900">{head}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {subHead1}{" "}
          <Link
            href={link1}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {subHead2}
          </Link>
        </p>
      </div>
    </>
  );
};

export default HeaderAuth;
