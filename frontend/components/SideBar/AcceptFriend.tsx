import React, { useState } from "react";
import ImageWithSkeleton from "./image";
import { Button } from "../ui/button";
import { IoMdClose } from "react-icons/io";
const AcceptFriends = ({
  isOpen,
  onSave,
}: {
  isOpen: boolean;
  onSave: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:text-black">
      <div className="relative rounded-lg w-1/3 h-1/3 bg-white grid grid-cols-3 gap-3 p-6">
        <IoMdClose
          size={25}
          className="absolute right-0 hover:cursor-pointer"
          onClick={() => {
            onSave();
          }}
        />
        <div className="col-span-1 flex">
          <ImageWithSkeleton
            src={"https://github.com/shadcn.png"}
            alt="demo"
            className="justify-center items-center"
            imgClass="rounded-lg"
          />
        </div>
        <div className="col-span-2 grid grid-rows-2">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">
              Nguyễn Gia Huy đã gửi lời mời kết bạn cho bạn
            </span>
            <span className="italic">Ngày gửi: 22/02/2025</span>
          </div>
          <div className="flex justify-evenly items-center">
            <Button className="bg-red-500 hover:bg-red-600">Từ chối</Button>
            <Button className="bg-green-500 hover:bg-green-600">
              Chấp nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptFriends;
