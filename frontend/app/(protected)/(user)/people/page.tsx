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
import PopoverChat from "@/components/PopoverChat";

function Page() {
  const { userId } = useUser();
  const [loading, setLoading] = useState(false);
  const [friendChat, setFriendChat] = useState<iFriend>();
  const [conversationID, setConversation] = useState<string>("");
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
        <div className="w-full flex flex-wrap justify-center gap-10">
          <div className="w-[500px]">
            <strong>Danh sách bạn bè</strong>
            {friendList && friendList.length == 0 && (
              <div className="sticky top-0 h-10 bg-blue-300 px-2 flex items-center font-bold">
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
                onStartConversation={(id) => {
                  const handleConversation = async () => {
                    try {
                      const res = await axios.post("/api/conversation", {
                        friend_id: id,
                      });
                      console.log("ID", res.data.id);
                      const result = res.data.id;
                      setConversation(result);
                      setFriendChat(friendList.find((f) => f.id == id));
                    } catch (error) {
                      console.log("Lỗi: ", error);
                    }
                  };
                  if (id != conversationID && !conversationID)
                    handleConversation();
                  else {
                    toast.warning("Vui lòng xóa hộp thoại");
                  }
                }}
              />
            )}
          </div>
          <div className="w-[500px]">
            <strong>Danh sách chờ kết bạn</strong>
            {pendingFriendList && pendingFriendList.length == 0 && (
              <div className="sticky top-0 h-10 bg-blue-300 px-2 flex items-center font-bold">
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
                onStartConversation={(id) => {}}
              />
            )}
          </div>
        </div>
      </div>
      {conversationID && (
        <Chat
          IDconversation={conversationID}
          IDfriend={friendChat}
          isOpen={() => setConversation("")}
        />
      )}
    </>
  );
}

export default Page;
