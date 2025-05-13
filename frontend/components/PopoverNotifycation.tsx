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

function PopoverNotifycation() {
  const { userId } = useUser();
  const [notification, setNotification] = useState<iFollowNoti[]>([]);
  useEffect(() => {
    const channel = echo.private(`notifications.${userId}`);
    channel.listen("notification.created", (e: any) => {
      console.log("Đã nhận sự kiện:", e);
    });
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IoMdNotifications
          size={32}
          className="cursor-pointer transition-transform hover:scale-130"
        />
      </PopoverTrigger>
      <PopoverContent className="z-10 w-72 mr-10 p-2 space-y-2 max-h-100 overflow-y-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
        {notification.length !== 0 ? (
          notification.map((noti) => (
            <div
              key={noti.id}
              className="p-2 border-b border-gray-200 dark:border-slate-600"
            >
              <p className="text-sm font-medium">{noti.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {noti.actor.name} → {noti.target.name}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(noti.created_at).toLocaleString("vi-Vn")}
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
