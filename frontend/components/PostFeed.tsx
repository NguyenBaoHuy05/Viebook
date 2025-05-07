"use client";
import { useEffect, useRef, useState } from "react";
import iPost from "@/interface/post";
import Post from "@/components/Post";
import CreateAPost from "@/components/CreateAPost";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axiosConfig";

type Props = {
  onSelectPost: (postId: string) => void;
  userId?: string;
};

export default function PostFeed({ onSelectPost, userId }: Props) {
  const [posts, setPosts] = useState<iPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const query =
          `/api/posts?page=${currentPage}` + (userId ? `&user=${userId}` : "");
        const res = await axios.get(query);
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
            (newPost) => !prevPosts.some((p) => p.id === newPost.id)
          );
          return [...prevPosts, ...newPosts];
        });

        if (fetchedPosts.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, userId]);

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

  return (
    <div
      ref={containerRef}
      className="col-span-2 flex flex-col gap-8 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <CreateAPost />
      {posts.map((post) => (
        <Post key={post.id} post={post} onSelectPost={onSelectPost} />
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
  );
}
