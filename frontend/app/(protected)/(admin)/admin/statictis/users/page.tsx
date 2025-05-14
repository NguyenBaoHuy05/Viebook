import UserStatisticsChart from "@/components/Admin/UserChart";
export default function UserList() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Thống kê bài post</h1>
      <p className="mb-5">Đây là trang hiển thị danh sách người dùng.</p>
      <UserStatisticsChart />
    </div>
  );
}
