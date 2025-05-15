"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/Modal/LoadingPage";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  block: boolean;
  count_follower: number | string;
  count_friend: number | string;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersRaw, setUsersRaw] = useState<User[]>([]);
  const [select, setSelect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users");
        setUsersRaw(response.data);
        setUsers(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách người dùng!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateBlock = async (userId: number, value: string) => {
    try {
      await axios.put(`/api/admin/users/block`, {
        id: userId,
        is_blocked: value === "true", // true hoặc false
      });
      setUsers(
        users.map((f) =>
          f.id === userId ? { ...f, block: value === "true" } : f
        )
      );
      toast.success("Thay đổi chế độ người dùng thành công!");
    } catch (error) {
      toast.error("Không thể block người dùng!");
      console.error(error);
    }
  };

  return (
    <>
      {loading && <LoadingPage isError={loading} />}
      <div className="p-4">
        <div className="flex mb-2">
          <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
          <select
            onChange={(e) => {
              const value = e.target.value;
              console.log(value);
              if (value === "block") {
                setUsers(usersRaw.filter((u) => u.block == true));
              } else if (value === "unblock") {
                setUsers(usersRaw.filter((u) => u.block == false));
              } else {
                setUsers(usersRaw);
              }
            }}
            className={`border rounded px-2 py-1 ml-auto`}
          >
            <option value="all">All</option>
            <option value="block">Block</option>
            <option value="unblock">Unblock</option>
          </select>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Blocked</th>
              <th className="border border-gray-300 px-4 py-2">Follower</th>
              <th className="border border-gray-300 px-4 py-2">Friend</th>
              <th className="border border-gray-300 px-4 py-2">Created_at</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.role === "admin" ? (
                    <span className="text-gray-500 italic">
                      Không thể block
                    </span>
                  ) : (
                    <select
                      value={user.block ? "true" : "false"}
                      onChange={(e) => {
                        handleUpdateBlock(user.id, e.target.value);
                      }}
                      className={`border rounded px-2 py-1 ${
                        user.block ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      <option value="true" className="bg-red-500">
                        Yes
                      </option>
                      <option value="false" className="bg-green-500">
                        No
                      </option>
                    </select>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {String(user.count_follower)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {String(user.count_friend)}
                </td>
                <td className="text-center">
                  {new Date(user.created_at).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
