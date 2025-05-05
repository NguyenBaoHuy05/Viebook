import React from "react";
import ImageWithSkeleton from "../SideBar/image";
import { useState } from "react";
import AcceptFriends from "../SideBar/AcceptFriend";

interface FriendProps {
  open: boolean;
  onSave: () => void;
  data: any; // Replace 'any' with the appropriate type for 'data'
}

const Friend: React.FC<FriendProps> = ({ open, onSave, data }) => {
  const [isClick, setIsClick] = useState(true);
  return (
    <>
      {isClick && (
        <AcceptFriends isOpen={isClick} onSave={() => setIsClick(false)} />
      )}
      <div className="rounded-lg border-black border-2 flex flex-col p-2">
        {open && (
          <div className="flex flex-col mb-2">
            <b>Danh sách đang chờ kết bạn:</b>
            <div
              onClick={() => setIsClick(true)}
              className="hover:cursor-pointer flex gap-3 overflow-x-auto mt-1 mb-1 p-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500"
            >
              <div className="h-30 text-xs p-0.5 rounded-lg border-red-200 border-2 hover:-translate-y-0.5">
                <ImageWithSkeleton
                  src={"https://github.com/shadcn.png"}
                  alt="demo"
                  className="w-25 h-20"
                  imgClass="rounded-lg"
                />
                <div className="mt-1 ml-1 font-semibold">Phan Tuấn Khang </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col mb-2 ">
          <b>Danh sách bạn bè:</b>
          <div className="hover:cursor-pointer flex gap-3 overflow-x-auto mt-1 mb-1 pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
            <div className="h-30 p-0.5 text-xs rounded-lg border-green-200 border-2 ">
              <ImageWithSkeleton
                src={"https://github.com/shadcn.png"}
                alt="demo"
                className="w-25 h-20"
                imgClass="rounded-lg"
              />
              <div className="mt-1 ml-1 font-semibold">Phan Tuấn Khang </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friend;
