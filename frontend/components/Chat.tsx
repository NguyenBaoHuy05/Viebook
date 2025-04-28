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
    /* Code comment để test kết nối */

    // channel
    //   .subscribed(() => {
    //     console.log("Đã kết nối đến kênh:", conversationId);
    //   })
    //   .error((err: any) => {
    //     console.error("Lỗi kết nối đến kênh:", err);
    //   });
    channel.listen(".message.sent", (e: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: e.message.id,
          user_id:
            e.message.user_id == userId
              ? "Tôi"
              : `User ${e.message.sender_name}`,
          content: e.message.content,
        },
      ]);
    });

    return () => {
      channel.stopListening(".message.sent");
    };
  }, [conversationId, userId]);

  useEffect(() => {
    axios
      .get(`/api/${conversationId}/messages`)
      .then((res) => {
        console.log("Tin nhắn:", res.data);
        setMessages(
          res.data.map((msg: any) => ({
            id: msg.id,
            user_id: msg.user_id == userId ? "Tôi" : `User ${msg.user_id}`,
            content: msg.content,
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

    const fakeMessage: Message = {
      id: Date.now(),
      user_id: "Tôi",
      content: input,
    };

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút mở chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          💬 Chat
        </button>
      )}

      {/* Hộp chat */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span>Chat</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-md fit-content ${
                  msg.user_id === "Tôi"
                    ? "bg-blue-300 text-right self-end"
                    : "bg-gray-300 text-left self-start"
                }`}
              >
                <p className="text-sm font-medium">{msg.user_id}</p>
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input chat */}
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
