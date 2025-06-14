"use client";
import React, { useEffect, useState } from "react";
import VideoCard from "@/components/Admin/VideoCard";
import Logo from "@/logo/logo";

function AdminDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Viebook</h1>
      <p className="mb-5">Chào mừng đến với trang admin của Viebook.</p>
      <VideoCard
        title="Hướng dẫn nhanh về Dashboard"
        description="Xem video này để hiểu cách sử dụng và các số liệu trên trang tổng quan quản trị."
      />
    </div>
  );
}

export default AdminDashboard;
