"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import echo from "@/lib/echo";
import axios from "@/lib/axiosConfig";
import { useUser } from "@/context/UserContext";

interface Message {
  id: number;
  user_id: string;
  content: string;
  is_read?: boolean;
  is_deleted?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationID] = useState<string>("1");
  const [error, setError] = useState<string | null>(null);

  const { userId } = useUser();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = echo.channel(`chat.${conversationId}`);
    channel.listen(".message.sent", (e: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: e.message.id,
          user_id:
            e.message.user_id == userId ? "Tôi" : `User ${e.message.user_id}`,
          content: e.message.content,
        },
      ]);
    });
    channel.listen(".message.DelOrStore", (e: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === e.message.id
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
        setMessages(
          res.data.map((msg: any) => ({
            id: msg.id,
            user_id: msg.user_id == userId ? "Tôi" : `User ${msg.user_id}`,
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
      await axios.post(
        `/api/${userId}/send`,
        {
          conversation_id: conversationId,
          content: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          💬 Chat
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-xl shadow-2xl flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span>Chat</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-2">
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
                  <p className="text-sm mt-1">{msg.content}</p>
                )}

                {msg.user_id === "Tôi" && (
                  <div className="flex gap-2 text-xs mt-1 justify-end">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(msg.id, true)}
                    >
                      Xóa
                    </button>
                    {msg.is_deleted && (
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSend} className="text-blue-600">
              <SendHorizonal />
            </button>
            {error && (
              <div className="text-red-500 text-xs text-center p-1">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
