"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/Modal/LoadingPage";
interface Post {
  id: number;
  used_id: number;
  title: string;
  type_content: string;
  react_count: number | string;
  comment_count: number | string;
  share_count: number | string;
  created_at: string;
  user: {
    id: number,
    name: string
  }
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/admin/posts");
        setPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách người dùng!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      await axios.delete(`/api/admin/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Xóa bài viết thành công!");
    } catch (error) {
      toast.error("Không thể xóa bài viết!");
      console.error(error);
    }
  };


  return (
    <>
      {loading && <LoadingPage isError={loading}/>}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Quản lý bài Post</h1>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID Post</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">React_Count</th>
              <th className="border border-gray-300 px-4 py-2">Comment_Count</th>
              <th className="border border-gray-300 px-4 py-2">Share_Count</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>


            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="border border-gray-300 px-4 py-2">{post.id}</td>
                <td className="border border-gray-300 px-4 py-2">{post.user?.name || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{String(post.title)}</td>
                <td className="border border-gray-300 px-4 py-2">{String(post.type_content)}</td>
                <td className="border border-gray-300 px-4 py-2">{String(post.react_count)}</td>
                <td className="border border-gray-300 px-4 py-2">{String(post.comment_count)}</td>
                <td className="border border-gray-300 px-4 py-2">{String(post.share_count)}</td>
                {/* <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td> */}
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
    
  );
}

// Bọc bằng ProtectedRoute và export
// export default function AdminPageWrapper() {
//   return (
//       {loading && <LoadingPage isError={false}/>}
//       <AdminPage />
//   );
// }
