"use client";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import iPost from "@/interface/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "@/lib/axiosConfig";
import Image from "next/image";
import ImageWithSkeleton from "./SideBar/image";
import CommentFeed from "./CommentFeed";
function Post({
  post,
  onSelectPost,
}: {
  post: iPost;
  onSelectPost: (postId: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactCount);
  const [showComment, setShowComment] = useState(false);
  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    const res = await axios.post(`api/posts/${post.id}/react`);
    console.log(res);
  };

  const handleCommentClick = () => {
    onSelectPost(post.id);
    setShowComment(!showComment);
  };
  useEffect(() => {
    const getReact = async () => {
      const res = await axios.get(`api/posts/${post.id}/getReact`);
      console.log(res);
      setIsLiked(res.data.status);
    };
    getReact();
  });
  return (
    <div className="flex justify-between">
      <div className="bg-gray-50 rounded-xl transition-shadow duration-200 p-4 mb-4 shadow-[0px_0px_4px_1px_gray] hover:cursor-pointer w-180">
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
          <div className="flex ml-auto  rounded-lg">
            <button
              onClick={handleLike}
              className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              {isLiked ? (
                <AiFillLike size={20} className="text-blue-500" />
              ) : (
                <AiOutlineLike size={20} className="text-gray-500" />
              )}
              <span className="text-gray-600 text-lg font-medium">
                {likeCount}
              </span>
            </button>
            <button
              onClick={handleCommentClick}
              className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <FaCommentAlt
                size={20}
                className={showComment ? `text-blue-500` : "text-gray-500"}
              />
              <span className="text-gray-600 text-lg font-medium">
                {post.commentCount}
              </span>
            </button>

            <button className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
              <FaShare size={20} className="text-gray-400" />
              <span className="text-gray-600 text-lg font-medium">
                {post.shareCount}
              </span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          {post.content ? (
            <>
              <p className="text-gray-800 text-lg mb-4">{post.title}</p>
              <div className="relative w-full rounded-lg overflow-hidden">
                <ImageWithSkeleton
                  src={post.content}
                  alt="content"
                  className="h-1/2"
                  imgClass="object-cover"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-120 w-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl text-center px-6">
              <p className="text-2xl font-semibold text-gray-800 leading-snug">
                {post.title}
              </p>
            </div>
          )}
        </div>
      </div>
      {showComment && (
        <div className="">
          <CommentFeed postId={post.id} />
        </div>
      )}
    </div>
  );
}

export default Post;
