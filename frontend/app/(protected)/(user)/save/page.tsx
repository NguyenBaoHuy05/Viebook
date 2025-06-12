"use client";
import { useEffect, useRef, useState } from "react";
import iPost from "@/interface/post";
import Post from "@/components/Post";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axiosConfig";
import { useUser } from "@/context/UserContext";

export default function SavePage() {
  const [posts, setPosts] = useState<iPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/saved-posts");
        setPosts(res.data.posts);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div
        className="flex flex-col gap-8 bg-white col-span-3 w-180"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        <h2 className="text-2xl font-bold text-center mt-4 mb-2">Bài viết đã lưu</h2>
        {loading && (
          <div className="flex items-center justify-center gap-2 p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang tải bài viết...</span>
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center p-4 text-gray-500">Bạn chưa lưu bài viết nào.</div>
        )}
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onSelectPost={() => {}}
            setShowModal={() => {}}
            isShared={false}
          />
        ))}
      </div>
    </div>
  );
}
