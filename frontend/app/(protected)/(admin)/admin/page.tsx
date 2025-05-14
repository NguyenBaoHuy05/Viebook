import React from "react";
function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 dark:bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
      </div>

      {/* Phần hiển thị giá trị (số liệu thống kê) */}
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value !== undefined ? value : "..."}
        </p>
        <p className="text-sm text-green-500 mt-1">+5 so với hôm qua</p>
      </div>
    </div>
  );
}

// Component chính cho trang tổng quan Admin
// Bạn sẽ truyền dữ liệu thống kê (fetch từ API backend) vào component này qua props, ví dụ stats prop
function AdminOverview({ stats }) {
  // Sử dụng object destructuring và giá trị mặc định để tránh lỗi nếu stats chưa có
  const {
    newMembersToday, // Số thành viên mới hôm nay
    postsToday, // Số bài viết mới hôm nay
    totalMembers, // Tổng số thành viên
    totalPosts, // Tổng số bài viết (Thêm)
    totalComments, // Tổng số bình luận (Thêm)
  } = stats || {}; // Nếu stats undefined, dùng object rỗng

  return (
    // Container bao quanh, có padding và margin auto để căn giữa
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề trang */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Tổng quan hệ thống
      </h2>

      {/* Grid layout cho các Stat Card */}
      <div className="w-200 h-80 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <StatCard title="Thành viên mới hôm nay" value={newMembersToday} />
        <StatCard
          title="Bài viết mới hôm nay"
          value={postsToday} // Truyền dữ liệu thực tế
          // icon={<NewspaperIcon className="h-6 w-6" />} // Ví dụ Icon
        />
        <StatCard
          title="Số bình luận hôm nay"
          value={totalComments} // Truyền dữ liệu thực tế
          // icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} // Ví dụ Icon
        />
        <StatCard
          title="Số tương tác hôm nay"
          value={totalComments} // Truyền dữ liệu thực tế
          // icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} // Ví dụ Icon
        />
        <StatCard
          title="Tổng số thành viên"
          value={totalMembers} // Truyền dữ liệu thực tế
          // icon={<UsersIcon className="h-6 w-6" />} // Ví dụ Icon
        />

        <StatCard
          title="Tổng số bài viết"
          value={totalPosts} // Truyền dữ liệu thực tế
          // icon={<ArchiveBoxIcon className="h-6 w-6" />} // Ví dụ Icon
        />
        <StatCard
          title="Tổng số bình luận"
          value={totalComments} // Truyền dữ liệu thực tế
          // icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} // Ví dụ Icon
        />
        <StatCard
          title="tổng số tương tác"
          value={totalComments} // Truyền dữ liệu thực tế
          // icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />} // Ví dụ Icon
        />
        {/* Bạn có thể thêm các Card thống kê khác tại đây */}
        {/* Ví dụ: Lượt thích hôm nay, Tổng số lượt thích, Số báo cáo chưa xử lý,... */}
      </div>

      {/* Tùy chọn: Thêm các phần khác của dashboard dưới đây */}
      {/* Ví dụ: Bảng hoạt động gần đây, Biểu đồ,... */}
      {/* <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Hoạt động gần đây</h3>
          // ... Code hiển thị bảng hoặc danh sách hoạt động gần đây ...
      </div> */}
    </div>
  );
}

export default AdminOverview; // Export component để sử dụng
