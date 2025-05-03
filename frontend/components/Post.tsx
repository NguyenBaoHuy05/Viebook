"use client";
import Image from "next/image";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import iPost from "@/interface/post";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
function Post({ post }: { post: iPost }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={post.logo} alt="avt" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-lg">
            {post.name}
          </span>
          <span className="text-sm text-gray-500">{post.date}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 text-lg mb-4">{post.title}</p>
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src={post.content}
            alt="content"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          {isLiked ? (
            <AiFillLike size={28} className="text-blue-500" />
          ) : (
            <AiOutlineLike size={28} className="text-gray-500" />
          )}
          <span className="text-gray-600 text-lg font-medium">{likeCount}</span>
        </button>

        <button className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <FaCommentAlt size={28} className="text-gray-500" />
          <span className="text-gray-600 text-lg font-medium">
            {post.commentCount}
          </span>
        </button>

        <button className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <FaShare size={28} className="text-gray-500" />
          <span className="text-gray-600 text-lg font-medium">
            {post.shareCount}
          </span>
        </button>
      </div>
    </div>
  );
}

export default Post;
