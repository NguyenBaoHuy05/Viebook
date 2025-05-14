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
import { FaBookmark } from "react-icons/fa6";

function PopoverNotifycation() {
  const { userId, name } = useUser();
  const [notification, setNotification] = useState<iFollowNoti[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dotNoti, setDotNoti] = useState(false);

  const handleRedDot = async (id: string) => {
    try {
      const res = await axios.post("/api/notification/changeRedDot", {
        idNoti: id,
      });
      setNotification(
        notification.map((noti) =>
          noti.id === id ? { ...noti, is_read: true } : noti
        )
      );
    } catch (error) {
      setError("Có lỗi với Red Dot");
    }
  };
  useEffect(() => {
    try {
      const channel = echo.channel(`notifications.${userId}`);
      channel.listen(".notification.created", (e: any) => {
        setNotification((prev) => [e, ...prev]);
        setDotNoti(true);
      });
      return () => {
        channel.stopListening(".notification.created");
      };
    } catch (error) {
      setError("Không thể kết nối realtime");
    }
  }, [userId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/notification/getAllNotification");
        setNotification(res.data.notifications);
        setIsLoading(false);
      } catch (error) {
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
        <div className="relative" onClick={() => setDotNoti(false)}>
          <IoMdNotifications
            size={32}
            className="cursor-pointer transition-transform hover:scale-130"
          />
          {notification.length > 0 && dotNoti && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          )}
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
              onClick={() => {
                if (!noti.is_read) handleRedDot(noti.id);
              }}
              className="flex items-center p-2 border-b border-gray-200 dark:border-slate-600"
            >
              <div>
                <p className="text-sm font-medium">{noti.message} </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {noti.actor.name == name ? "bạn" : noti.actor.name} đã{" "}
                  {(() => {
                    switch (noti.type) {
                      case "like":
                        return "thích";
                      case "comment":
                        return "bình luận";
                      case "follow":
                        return "theo dõi ";

                      case "addFriend":
                        return "gửi lời mời kết bạn với ";
                      case "acceptFriend":
                        return "chấp nhận kết bạn với ";
                      case "deleteFriend":
                        return "xóa kết bạn với ";
                      default:
                        return noti.type;
                    }
                  })()}
                  {noti.target.name == name ? "bạn" : noti.target.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(noti.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              {noti.is_read ? (
                <FaBookmark className="text-green-500 ml-auto" />
              ) : (
                <FaBookmark className="text-red-500 ml-auto" />
              )}
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
