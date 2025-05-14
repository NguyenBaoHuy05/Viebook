"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import echo from "@/lib/echo";
import axios from "@/lib/axiosConfig";
import { useUser } from "@/context/UserContext";
import { iMessage } from "@/interface/messageType";
import iFriend from "@/interface/friendType";
import ImageWithSkeleton from "./SideBar/image";

interface iChat {
  IDconversation: string;
  IDfriend?: iFriend;
  isOpen: () => void;
}
const Chat = ({ IDconversation, IDfriend, isOpen }: iChat) => {
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationID] = useState<string>(IDconversation);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useUser();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = echo.channel(`chat.${conversationId}`);
    channel.listen(".message.sent", (e: any) => {
      if (IDfriend)
        setMessages((prev) => [
          ...prev,
          {
            id: e.message.id,
            user_id: e.message.user_id == userId ? "Tôi" : IDfriend.name,
            content: e.message.content,
          },
        ]);
    });
    channel.listen(".message.DelOrStore", (e: any) => {
      console.log("Tin nhắn mới:", e.message);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id == e.message.id
            ? { ...msg, is_deleted: e.message.is_deleted }
            : msg
        )
      );
    });
    return () => {
      channel.stopListening(".message.sent");
      channel.stopListening(".message.DelOrStore");
    };
  }, [conversationId, userId]);

  useEffect(() => {
    axios
      .get(`/api/${conversationId}/messages`)
      .then((res) => {
        if (IDfriend)
          setMessages(
            res.data.map((msg: any) => ({
              id: msg.id,
              user_id: msg.user_id == userId ? "Tôi" : IDfriend.name,
              content: msg.content,
              is_deleted: msg.is_deleted,
            }))
          );
      })
      .catch((err) => {
        console.error("Lỗi lấy tin nhắn:", err);
        setError("Không thể tải tin nhắn.");
      });
  }, [conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await axios.post(`/api/${userId}/send`, {
        conversation_id: conversationId,
        content: input,
      });
    } catch (err: any) {
      console.error("Lỗi gửi tin nhắn:", err.message);
    }
    setInput("");
  };

  const handleDelete = async (id: number, check: boolean) => {
    const confirmDelete = confirm(
      `Bạn có chắc chắn muốn ${check ? "xóa" : "khôi phục"} tin nhắn này?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/messages/${id}/${check ? 1 : 0}`);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_deleted: check } : msg))
      );
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi khi xóa hoặc khôi phục tin nhắn");
    }
  };

  return (
    <div className={`fixed right-4 z-50 flex bottom-12`}>
      <div className="ml-auto">
        <div className="bg-white w-80 h-96 rounded-xl shadow-2xl flex flex-col">
          <div className="bg-black text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <div className="hover:cursor-pointer">
              <ImageWithSkeleton
                src={IDfriend?.avatar ?? "https://github.com/shadcn.png"}
                alt="demo"
                className="w-8 h-8 "
                imgClass="rounded-full"
              />
            </div>
            <span className="mr-auto ml-2">{IDfriend && IDfriend.name}</span>
            <button onClick={isOpen}>✕</button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.user_id === "Tôi"
                    ? "bg-blue-300 text-right self-end"
                    : "bg-gray-300 text-left self-start"
                }`}
              >
                <p className="text-sm font-medium">{msg.user_id}</p>
                {msg.is_deleted ? (
                  <p className="text-sm italic text-gray-500">
                    Tin nhắn đã xóa
                  </p>
                ) : (
                  <p className="text-sm mt-1 break-words text-justify">
                    {msg.content}
                  </p>
                )}

                {msg.user_id === "Tôi" && (
                  <div className="flex gap-2 text-xs mt-1 justify-end">
                    {!msg.is_deleted ? (
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(msg.id, true)}
                      >
                        Xóa
                      </button>
                    ) : (
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleDelete(msg.id, false)}
                      >
                        Khôi phục
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-2 flex items-center gap-2">
            <input
              type="text"
              autoComplete="off"
              value={input}
              maxLength={200}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="text-blue-600 hover:cursor-pointer hover:text-blue-900"
            >
              <SendHorizonal />
            </button>
            {error && (
              <div className="text-red-500 text-xs text-center p-1">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
