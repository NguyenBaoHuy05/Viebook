"use client";
import Post from "@/components/Post";
import Header from "@/components/Header";
import CreateAPost from "@/components/CreateAPost";
import { useState, useEffect, useRef } from "react";
import iPost from "@/interface/post";
import axios from "@/lib/axiosConfig";
import CommentSection from "@/components/CommentSection";
import { Loader2 } from "lucide-react";
import echo from "@/lib/echo";
function Page() {
  const [posts, setPosts] = useState<iPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userComment, setUserComment] = useState<string>("");
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/posts?page=${currentPage}`);
        const fetchedPosts: iPost[] = res.data.data.map((post: any) => ({
          id: post.id,
          name: post.user.name,
          logo: "/avt.jpg",
          title: post.title,
          content: post.content,
          commentCount: post.comment_count,
          reactCount: post.react_count,
          shareCount: post.share_count,
          date: new Date(post.created_at).toLocaleDateString(),
        }));
        setPosts((prevPosts) => {
          const newPosts = fetchedPosts.filter(
            (newPost) =>
              !prevPosts.some((prevPost) => prevPost.id === newPost.id)
          );
          return [...prevPosts, ...newPosts];
        });

        if (fetchedPosts.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    const fetchComments = async () => {
      if (selectedPostId === null) return;

      try {
        const res = await axios.get(`/api/posts/${selectedPostId}/comments`);
        console.log(res);
        if (res.data) {
          setComments(res.data);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [selectedPostId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (
        scrollHeight - (scrollTop + clientHeight) < 100 &&
        hasMore &&
        !loading
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handleCommentClick = async () => {
    if (userComment == "") return;
    const res = await axios.get("api/user");
    const newComment = {
      content: userComment,
      id: selectedPostId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        username: res.data.user.username,
      },
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `api/posts/${selectedPostId}/comment`,
        {
          post_id: selectedPostId,
          parent_comment_id: null,
          content: userComment,
        },
        { withCredentials: true }
      );
      console.log(comments);
      setComments((prevComments) => [newComment, ...prevComments]);
    } catch (error) {
      console.error("Failed to create comment", error);
    } finally {
      setLoading(false);
      setUserComment("");
    }
  };
  useEffect(() => {
    if (!selectedPostId) return;

    const channel = echo.channel(`post.${selectedPostId}`);
    channel.listen("CommentCreated", (event: any) => {
      setComments((prevComments) => [event.comment, ...prevComments]);
    });

    return () => {
      channel.stopListening("CommentCreated");
    };
  }, [selectedPostId]);
  return (
    <>
      <div className="mt-25">
        <div className="grid grid-cols-4">
          <div className="col-span-1">a</div>
          <div
            ref={containerRef}
            className="col-span-2 flex flex-col gap-8 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <CreateAPost />
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onSelectPost={setSelectedPostId}
              />
            ))}
            {loading && (
              <div className="flex items-center justify-center gap-2 p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải thêm bài viết...</span>
              </div>
            )}
            {!hasMore && !loading && (
              <div className="text-center p-4 text-gray-500">
                Bạn đã xem hết bài viết
              </div>
            )}
          </div>
          <div className="col-span-1 h-full relative ">
            {selectedPostId && (
              <div>
                <CommentSection comments={comments} />
                <div className="absolute bottom-0 left-0 w-full bg-white px-4 py-3 border-t border-gray-200">
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
                      Gửi
                    </button>
                    <input
                      type="text"
                      placeholder="Viết bình luận..."
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={userComment}
                      disabled={loading}
                      onChange={(e) => setUserComment(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
