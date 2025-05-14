"use client";

import axios from "@/lib/axiosConfig";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Globe2, Users, Lock, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const privacyOptions = [
  {
    label: "Công khai",
    value: "public",
    icon: <Globe2 className="h-4 w-4 mr-1" />,
  },
  {
    label: "Bạn bè",
    value: "friends",
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    label: "Riêng tư",
    value: "private",
    icon: <Lock className="h-4 w-4 mr-1" />,
  },
];

function Share({
  showModal,
  setShowModal,
  postID,
}: {
  showModal: boolean;
  setShowModal: (prop: boolean) => void;
  postID: string | null;
}) {
  const [data, setData] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/posts",
        {
          typeContent: "share_post",
          title: data,
          content: "",
          privacy: privacy,
          share_post_id: postID,
        },
        { withCredentials: true }
      );

      setData("");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative z-10 bg-white p-5 rounded-lg w-full max-w-md mx-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chia sẻ</h2>
              <button onClick={() => setShowModal(false)}>
                <IoMdClose className="h-6 w-6 text-gray-600 hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Suy nghĩ của bạn về bài viết này"
                className="w-full border border-gray-300 p-3 rounded-md resize-none min-h-[100px] focus:ring-2 focus:ring-blue-500"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />

              <div className="flex gap-2 items-center text-sm">
                {privacyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPrivacy(option.value)}
                    className={cn(
                      "flex items-center px-3 py-1 rounded-full border transition",
                      privacy === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                    )}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
              >
                Share
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Share;
