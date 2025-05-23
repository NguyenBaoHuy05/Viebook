"use client";
import { useEffect, useRef, useState } from "react";
import iPost from "@/interface/post";
import Post from "@/components/Post";
import CreateAPost from "@/components/CreateAPost";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axiosConfig";
import { useUser } from "@/context/UserContext";
type Props = {
  onSelectPost: (postId: string) => void;
  setShowModal: (prop: boolean) => void;
  userOwner?: string;
  isOnAccountPage: boolean | false;
};

export default function PostFeed({
  onSelectPost,
  userOwner,
  setShowModal,
  isOnAccountPage,
}: Props) {
  const [posts, setPosts] = useState<iPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { userId } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || !hasMore) return;
      console.log(userOwner);
      setLoading(true);
      try {
        let query = `/api/posts?page=${currentPage}`;
        if (isOnAccountPage) {
          query += userOwner ? `&user=${userOwner}` : "";
        }

        console.log(query);
        const res = await axios.get(query);
        const fetchedPosts: iPost[] = res.data.data.map((post: any) => ({
          id: post.id,
          name: post.user.name,
          userId: post.user.id,
          logo: post.user.profile_picture
            ? post.user.profile_picture
            : "https://github.com/shadcn.png",
          title: post.title,
          content: post.content,
          commentCount: post.comment_count,
          reactCount: post.react_count,
          shareCount: post.share_count,
          date: new Date(post.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          sharePostID: post.share_post_id,
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
  }, [currentPage, userOwner]);

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
      className="flex flex-col gap-8 bg-white col-span-3 w-180"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      {userOwner == userId && <CreateAPost />}
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onSelectPost={onSelectPost}
          setShowModal={setShowModal}
          isShared={false}
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
  );
}
