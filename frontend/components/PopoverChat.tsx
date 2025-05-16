"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { IConversation } from "@/interface/conversationType";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbMessageChatbot } from "react-icons/tb";
import axios from "@/lib/axiosConfig";
import ImageWithSkeleton from "./SideBar/image";
import Chat from "./Chat";
import iFriend from "@/interface/friendType";
import { toast } from "sonner";

function PopoverChat() {
  const [conversations, setConversations] = useState<IConversation[]>();
  const [selectedConv, setSelectedConv] = useState<IConversation>();
  const [friend, setFriend] = useState<iFriend>();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleConversation = async () => {
      try {
        const res = await axios.get("/api/allConversationPrivate");
        setConversations(res.data);
      } catch (error) {
        console.log("Lỗi", error);
      }
    };
    if (!conversations) handleConversation();
  }, [conversations]);
  return (
    <div className="fixed right-4 z-50 flex bottom-4">
      {selectedConv && isOpen && (
        <Chat
          IDconversation={String(selectedConv.id)}
          IDfriend={friend}
          isOpen={() => {
            setSelectedConv(undefined);
            setIsOpen(false);
          }}
        />
      )}
      {!isOpen && (
        <Popover cl>
          <PopoverTrigger asChild>
            <TbMessageChatbot
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
          </PopoverTrigger>
          <PopoverContent className="z-50 w-72 mr-10 p-2 space-y-2 max-h-100 overflow-y-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
            {conversations && conversations.length !== 0 ? (
              conversations.map((conv) => {
                console.log(conv.participant);
                const participant = conv.participant;
                return (
                  <div
                    key={conv.id}
                    className="flex items-start gap-2 p-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setSelectedConv(conv);
                      setIsOpen(true);
                      setFriend(participant);
                    }}
                  >
                    <ImageWithSkeleton
                      src={
                        participant.avatar ?? "https://github.com/shadcn.png"
                      }
                      alt="avatar"
                      className="w-10 h-10"
                      imgClass=" rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm truncate">
                        {participant?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {conv.last_message?.content || "No messages yet"}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(conv.updated_at).toLocaleString("vi-Vn")}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-center text-gray-500">
                Không có hội thoại
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default PopoverChat;
