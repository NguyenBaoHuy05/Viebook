"use client";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import iPost from "@/interface/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "@/lib/axiosConfig";
import ImageWithSkeleton from "./SideBar/image";
import CommentFeed from "./CommentFeed";
import { useUser } from "@/context/UserContext";

function Post({
  post,
  onSelectPost,
  setShowModal,
  isShared = false,
}: {
  post: iPost;
  onSelectPost: (postId: string) => void;
  setShowModal: (prop: boolean) => void;
  isShared: boolean;
}) {
  const { userId } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactCount);
  const [showComment, setShowComment] = useState(false);
  const [sharedPost, setSharedPost] = useState<iPost | null>(null);
  const [commentCount, setCommentCount] = useState(post.commentCount);
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
  }, [post.id]);

  const handleShare = () => {
    onSelectPost(post.id);
    setShowModal((prev) => !prev);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      try {
        await axios.delete(`/api/posts/${post.id}`);
        window.location.reload();
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  useEffect(() => {
    if (post.sharePostID) {
      const fetchSharedPost = async () => {
        try {
          const res = await axios.get(`/api/posts/${post.sharePostID}`);
          const sharedPostData = res.data.data;
          setSharedPost({
            id: sharedPostData.id,
            userId: sharedPostData.user.id,
            name: sharedPostData.user.name,
            logo: sharedPostData.user.profile_picture
              ? sharedPostData.user.profile_picture
              : "https://github.com/shadcn.png",
            title: sharedPostData.title,
            content: sharedPostData.content,
            commentCount: sharedPostData.comment_count,
            reactCount: sharedPostData.react_count,
            shareCount: sharedPostData.share_count,
            date: new Date(sharedPostData.created_at).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            ),
            sharePostID: sharedPostData.share_post_id ?? null,
          });
        } catch (err) {
          console.error("Failed to fetch shared post:", err);
        }
      };
      fetchSharedPost();
    }
  }, [post.sharePostID]);

  return (
    <div className="flex justify-between mb-4 col-span-3 relative">
      <div className="bg-gray-50 rounded-xl p-4 shadow-[0px_0px_6px_2px_gray] hover:cursor-pointer w-full">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.logo} alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-lg">
              {post.name}
            </span>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>

          {!isShared && (
            <div className="flex ml-auto rounded-lg items-center">
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
                  {commentCount}
                </span>
              </button>

              <button
                className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={handleShare}
              >
                <FaShare size={20} className="text-gray-400" />
                <span className="text-gray-600 text-lg font-medium">
                  {post.shareCount}
                </span>
              </button>

              {userId && userId === post.userId && !isShared && (
                <div>
                  <button
                    onClick={handleDelete}
                    className="ml-auto px-3 py-2 bg-transparent border border-red-400 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 shadow-sm flex items-center gap-1 cursor-pointer"
                    style={{ marginLeft: "auto", alignSelf: "flex-start" }}
                    title="Xóa bài viết"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="font-medium text-sm">Xóa</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {sharedPost ? (
            <div>
              <p className="font-semibold text-gray-800 text-xl my-2">
                {post.title}
              </p>
              <div className="bg-blue-50 p-4 border border-blue-200 rounded-xl mb-4">
                <div className="mt-2">
                  <div className=" p-4 rounded-lg mt-2">
                    <Post
                      post={sharedPost}
                      onSelectPost={onSelectPost}
                      setShowModal={setShowModal}
                      isShared={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : post.content ? (
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
        <CommentFeed
          postId={post.id}
          setShowComment={setShowComment}
          setCommentCount={setCommentCount}
        />
      )}
    </div>
  );
}

export default Post;
