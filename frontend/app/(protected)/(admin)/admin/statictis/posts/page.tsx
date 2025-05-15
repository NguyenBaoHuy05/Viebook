import React from "react";
import PostChart from "@/components/Admin/PostChart";
function page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Thống kê Post</h1>
      <p className="mb-5">Đây là trang hiển thị Post.</p>
      <PostChart />
    </div>
  );
}

export default page;
