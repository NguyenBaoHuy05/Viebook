import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AiOutlineLike } from "react-icons/ai";
function Comment({ comment }: { comment: any }) {
  return (
    <div className="flex flex-col p-4 pb-16 border-b border-gray-300 gap-3">
      <div className="flex items-start gap-5">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="avt" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{comment.username}</span>
            <span className="text-xs text-gray-500">{comment.timestamp}</span>
          </div>
          <p className="text-sm text-gray-800">{comment.content}</p>

          <div className="flex gap-4">
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
