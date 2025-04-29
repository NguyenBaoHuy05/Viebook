import React from "react";

export default function Sidebar() {
  return (
    <div className="mt-25">
      <div className="grid grid-cols-3 max-w-240 mx-auto gap-4 h-50 mb-4">
        <div className="rounded col-span-1 bg-gray-200 p-4 grid grid-rows-6">
          Ảnh đại diện
        </div>
        <div className="rounded col-span-2 bg-gray-300 p-4">Bio</div>
      </div>
      <div className="bg-gray-200 max-w-240 mx-auto h-50 mb-4">Bạn bè</div>
      <div className="bg-gray-200 max-w-240 mx-auto h-50">Bài Post</div>
    </div>
  );
}
