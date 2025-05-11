import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AiOutlineLike } from "react-icons/ai";
import axios from "@/lib/axiosConfig";
import { Loader2 } from "lucide-react";
function Comment({ comment: commentData }: { comment: any }) {
  const [currentComment, setCurrentComment] = useState(commentData);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const formattedDate = new Date(currentComment.created_at).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleReplySubmit = async () => {
    setLoading(true);
    try {
      await axios.post(
        `/api/posts/${currentComment.post_id}/comment`,
        {
          post_id: currentComment.post_id,
          parent_comment_id: currentComment.id,
          content: replyContent,
        },
        { withCredentials: true }
      );

      console.log("Reply posted successfully");
      setReplyContent("");
      setShowReplyInput(false);
    } catch (err) {
      console.error("Failed to reply", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 border-gray-300 gap-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm text-gray-800">
          {currentComment.user.username}
        </span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="avt" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2 flex-1">
          {currentComment.parent && currentComment.parent.user && (
            <span className="text-blue-600 font-medium text-sm">
              @{currentComment.parent.user.username}
            </span>
          )}

          <p className="text-sm text-gray-800">{currentComment.content}</p>

          <div className="flex gap-4 mt-1">
            <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
              <AiOutlineLike size={20} />
            </button>
            <button
              className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleReplyClick}
            >
              Trả lời
            </button>
          </div>

          {showReplyInput && (
            <div className="bg-gray-100 rounded-lg p-3 flex flex-col gap-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Trả lời @${currentComment.user.username}`}
                className="w-full resize-none p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReplyInput(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleReplySubmit}
                  disabled={loading}
                  className={`px-4 py-1 text-sm rounded-xl transition ${
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Gửi"
                  )}
                </button>
              </div>
            </div>
          )}

          {currentComment.replies && currentComment.replies.length > 0 && (
            <div>
              {currentComment.replies.map((reply: any) => (
                <Comment key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
