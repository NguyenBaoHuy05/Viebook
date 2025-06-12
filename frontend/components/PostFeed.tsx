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

function AdYoutube({ title, youtubeId }: { title: string; youtubeId: string }) {
  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white-100 p-4 flex flex-col items-center gap-2">
      <div className="font-bold text-black-700 text-3xl mb-2">{title}</div>
      <div className="w-full flex justify-center">
        <iframe
          width="100%"
          height="300"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

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

  // Tạo mảng posts + quảng cáo
  const postsWithAds = [];
  const adList = [
    
    { title: "Đăng ký kênh YouTube của chúng tôi!", youtubeId: "2C1T_lVw7_w" },
    { title: "Gennin mạnh nhất Konoha", youtubeId: "lVO1XeXpcUY" },
    { title: "Học Viện Anime", youtubeId: "I60Ygko8fBg" },
    { title: "Muse Việt Nam", youtubeId: "qaW6wV42MY" },
    // Thêm nhiều quảng cáo nếu muốn
  ];
  let adIndex = 0;
  for (let i = 0; i < posts.length; i++) {
    postsWithAds.push(
      <Post
        key={posts[i].id}
        post={posts[i]}
        onSelectPost={onSelectPost}
        setShowModal={setShowModal}
        isShared={false}
      />
    );
    if ((i + 1) % 5 === 0) {
      const ad = adList[adIndex % adList.length];
      postsWithAds.push(
        <AdYoutube key={`ad-${i}`} title={ad.title} youtubeId={ad.youtubeId} />
      );
      adIndex++;
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-8 bg-white col-span-3 w-180"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      {userOwner == userId && <CreateAPost />}
      {postsWithAds}
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
