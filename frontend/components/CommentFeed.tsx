"use client";

import { useEffect, useState } from "react";
import CommentSection from "@/components/CommentSection";
import echo from "@/lib/echo";
import axios from "@/lib/axiosConfig";
import { Loader2 } from "lucide-react";

type Props = {
  postId: string;
};

export default function CommentFeed({ postId }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}/comments`);
        setComments(res.data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // Listen for new comments via Echo
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
    <div className="relative border-2 border-b-0 ml-2 rounded-lg">
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
  );
}
