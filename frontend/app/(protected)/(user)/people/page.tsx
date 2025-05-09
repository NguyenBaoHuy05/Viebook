"use client";
import { useEffect, useState } from "react";
import ImageWithSkeleton from "@/components/SideBar/image";

import { FaHome } from "react-icons/fa";
import { TiMessage } from "react-icons/ti";
import { AiOutlineUserDelete } from "react-icons/ai";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import axios from "@/lib/axiosConfig";
import iFriend from "@/interface/friendType";
import LoadingPage from "@/components/Modal/LoadingPage";
import People from "@/components/People/people";
import Chat from "@/components/Chat";

function Page() {
  const { userId } = useUser();
  const [loading, setLoading] = useState(false);
  const [friendList, setFriendList] = useState<iFriend[]>();
  const [pendingFriendList, setPendingFriendList] = useState<iFriend[]>();

  useEffect(() => {
    const handleFriendList = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/friends/friendList", {
          params: { friend_id: userId },
        });
        setFriendList(response.data.friends);
        console.log("Chạy thành công");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Lỗi");
        console.log(error);
      }
    };
    const handlePendingFriendList = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/friends/pendingList", {
          params: { friend_id: userId },
        });
        setPendingFriendList(response.data.pending_friends);
        console.log("Chạy thành công");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Lỗi");
        console.log(error);
      }
    };
    handleFriendList();
    handlePendingFriendList();
  }, [userId]);
  if (loading) return <LoadingPage isError={loading} />;
  return (
    <>
      <div className="mt-25">
        <div className="grid grid-cols-7">
          <div className="col-span-1"></div>
          <div className="col-span-5 grid grid-cols-2 gap-10">
            <div>
              <strong>Danh sách bạn bè</strong>
              {friendList && friendList.length == 0 && (
                <div className="z-20 sticky top-0 h-10 bg-blue-200 px-2 flex items-center font-bold">
                  Không có bạn bè
                </div>
              )}
              {friendList && (
                <People
                  friends={friendList}
                  pending={false}
                  onSave={(id, check) => {
                    if (!check && friendList) {
                      setFriendList(friendList.filter((f) => f.id !== id));
                    }
                  }}
                />
              )}
            </div>
            <div>
              <strong>Danh sách chờ kết bạn</strong>
              {pendingFriendList && pendingFriendList.length == 0 && (
                <div className="z-20 sticky top-0 h-10 bg-blue-200 px-2 flex items-center font-bold">
                  Không có ai chờ kết bạn
                </div>
              )}
              {pendingFriendList && (
                <People
                  friends={pendingFriendList}
                  pending={true}
                  onSave={(id, check) => {
                    if (check && friendList) {
                      const friend = pendingFriendList.find((f) => f.id === id);
                      if (friend) {
                        setFriendList([...friendList, friend]);
                        setPendingFriendList(
                          pendingFriendList.filter((f) => f.id !== id)
                        );
                      }
                    } else {
                      setPendingFriendList(
                        pendingFriendList.filter((f) => f.id !== id)
                      );
                    }
                  }}
                />
              )}
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
      <Chat />
    </>
  );
}

export default Page;
