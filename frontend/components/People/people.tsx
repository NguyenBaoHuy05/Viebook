import { FaHome } from "react-icons/fa";
import { TiMessage } from "react-icons/ti";
import { AiOutlineUserDelete, AiOutlineUserAdd } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import ImageWithSkeleton from "../SideBar/image";
import iFriend from "@/interface/friendType";
import Link from "next/link";
import AlertDialogDemo from "../Modal/AlertDialog";
import { toast } from "sonner";
import { useState } from "react";
import axios from "@/lib/axiosConfig";

interface Props {
  friends: iFriend[];
  pending: boolean;
  onSave: (id: string, check: boolean) => void;
}

const groupFriendsByFirstLetter = (friends: iFriend[]) => {
  return friends.reduce((acc, friend) => {
    const letter = friend.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(friend);
    return acc;
  }, {} as Record<string, iFriend[]>);
};

const People = ({ friends, pending, onSave }: Props) => {
  const grouped = groupFriendsByFirstLetter(friends);
  const sortedLetters = Object.keys(grouped).sort();
  const [loading, setLoading] = useState(false);

  const handleRemoveFriend = async (id: string) => {
    try {
      setLoading(true);
      console.log("Id:", id);
      await axios.delete(`/api/friends/${id}`);
      toast.success("Đã xóa bạn bè thành công!");
      onSave(id, false);
    } catch (error) {
      toast.error("Lỗi khi xóa bạn.");
      console.error("Remove friend error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFriend = async (id: string) => {
    try {
      setLoading(true);
      console.log("Id:", id);
      const response = await axios.put("/api/friends/acceptFriend", {
        friend_id: id,
      });
      toast.success("Thêm bạn bè thành công.");
      onSave(id, true);
    } catch (error) {
      toast.error("Lỗi khi thêm bạn.");
      console.error("Add friend error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-150 h-fit border-2 overflow-y-auto rounded-b-lg [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
      {sortedLetters.map((letter) => (
        <div key={letter}>
          <div className="z-20 sticky top-0 h-10 bg-blue-200 px-2 flex items-center font-bold">
            {letter}
          </div>
          <div>
            {grouped[letter].map((friend) => (
              <div
                key={friend.id}
                className="h-15 border-b-2 p-2 flex items-center"
              >
                <ImageWithSkeleton
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-10 h-10"
                  imgClass="rounded-full"
                />
                <strong className="mx-2">{friend.name}</strong>
                <div className="ml-auto flex">
                  <Link href={`/account/${friend.username}`}>
                    <FaHome
                      size={25}
                      className="mr-5 hover:scale-120 hover:cursor-pointer"
                    />
                  </Link>
                  {!pending && (
                    <TiMessage
                      size={25}
                      className="mr-5 hover:scale-120 hover:cursor-pointer"
                    />
                  )}
                  {pending && (
                    <AlertDialogDemo
                      btn={
                        <AiOutlineUserAdd
                          size={25}
                          className="mr-5 hover:scale-120 hover:cursor-pointer"
                        />
                      }
                      title1="Thêm bạn bè"
                      title2={`Bạn có chắc chắn muốn kết bạn với ${friend.name}?`}
                      onSave={() => handleAcceptFriend(friend.id)}
                    />
                  )}
                  <AlertDialogDemo
                    btn={
                      pending ? (
                        <MdDelete
                          size={25}
                          className="mr-5 hover:scale-120 hover:cursor-pointer"
                        />
                      ) : (
                        <AiOutlineUserDelete
                          size={25}
                          className="mr-5 hover:scale-120 hover:cursor-pointer"
                        />
                      )
                    }
                    title1="Xóa bạn bè"
                    title2={
                      pending
                        ? `Bạn có chắc chắn muốn hủy lời mời kết bạn của ${friend.name}?`
                        : `Bạn có chắc chắn muốn xóa bạn bè với ${friend.name}?`
                    }
                    onSave={() => handleRemoveFriend(friend.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default People;
