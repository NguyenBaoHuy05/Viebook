import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AiOutlineLike } from "react-icons/ai";

function Comment({ comment }: { comment: any }) {
  const formattedDate = new Date(comment.created_at).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <div className="flex flex-col p-4 border-b border-gray-300 gap-3">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm text-gray-800">
          {comment.user.username}
        </span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="avt" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm text-gray-800">{comment.content}</p>

          <div className="flex gap-4 mt-1">
            <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
              <AiOutlineLike size={20} />
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
              Trả lời
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
