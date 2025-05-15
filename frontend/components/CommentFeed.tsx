"use client";

import { useEffect, useState } from "react";
import CommentSection from "@/components/CommentSection";
import echo from "@/lib/echo";
import axios from "@/lib/axiosConfig";
import { Loader2 } from "lucide-react";
import { IoMdClose } from "react-icons/io";

type Props = {
  postId: string;
  setShowComment: (prop: boolean) => void;
};

export default function CommentFeed({ postId, setShowComment }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}/comments`);
        console.log("comment ", res);
        setComments(res.data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    const channel = echo.channel(`post.${postId}`);
    channel.listen("CommentCreated", (event: any) => {
      setComments((prev) => [event.comment, ...prev]);
    });

    return () => {
      channel.stopListening("CommentCreated");
    };
  }, [postId]);

  const handleCommentClick = async () => {
    if (!userComment.trim()) return;
    setLoading(true);

    try {
      const userRes = await axios.get("/api/user");
      const newComment = {
        content: userComment,
        id: postId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          username: userRes.data.user.username,
        },
      };

      await axios.post(
        `/api/posts/${postId}/comment`,
        {
          post_id: postId,
          parent_comment_id: null,
          content: userComment,
        },
        { withCredentials: true }
      );

      setComments((prev) => [newComment, ...prev]);
      setUserComment("");
    } catch (error) {
      console.error("Failed to create comment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => setShowComment(false)}
      ></div>
      <div className="relative border-2 border-b-0 rounded-lg w-full max-w-lg bg-white pt-5">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black hover:scale-125 cursor-pointer"
          onClick={() => setShowComment(false)}
        >
          <IoMdClose className="h-6 w-6" />
        </button>
        <CommentSection comments={comments} />
        <div className="w-full px-3 py-3 ">
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-full transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
              onClick={handleCommentClick}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi"}
            </button>
            <input
              type="text"
              placeholder="Viết bình luận..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
