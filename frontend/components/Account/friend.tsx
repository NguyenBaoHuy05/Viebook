import React, { useEffect } from "react";
import ImageWithSkeleton from "../SideBar/image";
import { useState } from "react";
import AcceptFriends from "../SideBar/AcceptFriend";
import iFriend from "@/interface/friendType";

interface FriendProps {
  open: boolean;
  onSave: (data: string) => void;
  data?: iFriend[];
  dataFriend?: iFriend[];
}

const Friend: React.FC<FriendProps> = ({ open, onSave, data, dataFriend }) => {
  const [isClick, setIsClick] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  useEffect(() => {
    if (posPending) {
      setPosPending({ ...posPending });
      if (isAccept) {
        onSave(posPending.id);
      }
    }
  }, [isAccept]);
  const [posPending, setPosPending] = useState<iFriend>();
  return (
    <>
      {isClick && (
        <AcceptFriends
          isOpen={isClick}
          data={posPending}
          onSave={() => {
            setIsClick(false);
          }}
          onAccept={() => {
            setIsAccept(true);
          }}
        />
      )}
      <div className="rounded-lg border-black border-2 flex flex-col p-2 ">
        {open && (
          <div className="flex flex-col mb-2">
            <b>Danh sách đang chờ kết bạn:</b>
            <div className="flex gap-3 overflow-x-auto mt-1 mb-1 p-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
              {data && data.length === 0 && "Trống"}
              {data &&
                data.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsClick(true);
                      setPosPending(p);
                    }}
                    className="h-30 text-xs p-0.5 rounded-lg border-red-200 border-2 hover:cursor-pointer "
                  >
                    <ImageWithSkeleton
                      src={"https://github.com/shadcn.png"}
                      alt="demo"
                      className="w-25 h-20"
                      imgClass="rounded-lg"
                    />
                    <div className="mt-1 ml-1 font-semibold">{p.name}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="flex flex-col mb-2 ">
          <b>Danh sách bạn bè:</b>
          <div className="flex gap-3 overflow-x-auto mt-1 mb-1 p-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
            {dataFriend && dataFriend.length === 0 && "Trống"}
            {dataFriend &&
              dataFriend.map((p) => (
                <div
                  key={p.id}
                  className="h-30 text-xs p-0.5 rounded-lg border-red-200 border-2 hover:cursor-pointer "
                >
                  <ImageWithSkeleton
                    src={"https://github.com/shadcn.png"}
                    alt="demo"
                    className="w-25 h-20"
                    imgClass="rounded-lg"
                  />
                  <div className="mt-1 ml-1 font-semibold">{p.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Friend;
