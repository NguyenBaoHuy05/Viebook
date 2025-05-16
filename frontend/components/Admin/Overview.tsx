import React from "react";
import statProp from "@/interface/statType";

interface statCardProp {
  title: string;
  value: number;
  past?: number;
}
function StatCard({ title, value, past }: statCardProp) {
  return (
    <div className="bg-gray-800 dark:bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white dark:text-gray-400">
          {title}
        </h3>
      </div>

      {/* Phần hiển thị giá trị (số liệu thống kê) */}
      <div>
        <p className="text-3xl font-bold text-white dark:text-white">
          {value !== undefined ? value : "..."}
        </p>
        <p className="text-sm text-green-500 mt-1">
          {past !== undefined
            ? (value - past >= 0 ? "tăng " : "giảm ") +
              Math.abs(value - past) +
              " so với ngày hôm qua"
            : ""}
        </p>
      </div>
    </div>
  );
}

function AdminOverview({ stats }: { stats: { result: statProp } }) {
  const { member, post, comment, contact } = stats.result || {};
  const {
    today: membersToday,
    past: membersPast,
    total: totalMembers,
  } = member || {};
  const { today: postsToday, past: postsPast, total: totalPosts } = post || {};
  const {
    today: commentsToday,
    past: commentsPast,
    total: totalComments,
  } = comment || {};
  const {
    today: contactToday,
    past: contactPast,
    total: totalContact,
  } = contact || {};
  return (
    <div className="container px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Tổng quan hệ thống
      </h2>
      {/* Responsive */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Thành viên mới hôm nay"
          value={membersToday}
          past={membersPast}
        />
        <StatCard
          title="Bài viết mới hôm nay"
          value={postsToday}
          past={postsPast}
        />
        <StatCard
          title="Số bình luận hôm nay"
          value={commentsToday}
          past={commentsPast}
        />
        <StatCard
          title="Số tương tác hôm nay"
          value={contactToday}
          past={contactPast}
        />

        <StatCard
          title="Tổng số thành viên"
          value={totalMembers}
          past={undefined}
        />
        <StatCard
          title="Tổng số bài viết"
          value={totalPosts}
          past={undefined}
        />
        <StatCard
          title="Tổng số bình luận"
          value={totalComments}
          past={undefined}
        />
        <StatCard
          title="Tổng số tương tác"
          value={totalContact}
          past={undefined}
        />
      </div>
    </div>
  );
}

export default AdminOverview;
