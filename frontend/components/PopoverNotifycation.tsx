"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoMdNotifications } from "react-icons/io";
import echo from "@/lib/echo";
import { useUser } from "@/context/UserContext";
import { iFollowNoti } from "@/interface/notificationType";
import axios from "@/lib/axiosConfig";

function PopoverNotifycation() {
  const { userId, name } = useUser();
  const [notification, setNotification] = useState<iFollowNoti[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const channel = echo.private(`notifications.${userId}`);
      channel.listen("notification.created", (e: iFollowNoti) => {
        console.log("Đã nhận sự kiện:", e);
        setNotification((prev) => [e, ...prev]);
      });

      channel
        .subscribed(() => {
          console.log("Đăng ký vào channel");
        })
        .error((err: any) => {
          console.log("Lỗi subcribe channel: ", err);
        });
      return () => {
        channel.stopListening("notification.created");
        echo.leave(`notification.${userId}`);
      };
    } catch (error) {
      console.log("Lỗi: ", error);
      setError("Không thể kết nối realtime");
    }
  }, [userId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getAllNotification");
        console.log("Notification: ", res.data.notifications);
        setNotification(res.data.notifications);
        setIsLoading(false);
      } catch (error) {
        console.log("Lỗi: ", error);
        setError("Không thể tải dữ liệu");
        setIsLoading(false);
      }
    };
    fetchData();
    console.log("Name: ", name);
  }, [userId]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <IoMdNotifications
            size={32}
            className="cursor-pointer transition-transform hover:scale-130"
          />
          {/* TODO: Thêm indicator (chấm đỏ) nếu có thông báo chưa đọc */}
          {/* {notification.length > 0 && (
             <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
           )} */}
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-10 w-72 mr-10 p-2 space-y-2 max-h-100 overflow-y-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
        {isLoading && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Đang tải...
          </p>
        )}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        {notification.length !== 0 ? (
          notification.map((noti) => (
            <div
              key={noti.id}
              onClick={() => {}}
              className="p-2 border-b border-gray-200 dark:border-slate-600"
            >
              <p className="text-sm font-medium">{noti.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {noti.actor.name == name ? "bạn" : noti.actor.name} đã{" "}
                {noti.type}{" "}
                {noti.target.name == name ? "bạn" : noti.target.name}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(noti.created_at).toLocaleString("vi-VN")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Không có thông báo nào.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default PopoverNotifycation;
