"use client";
import React, { useEffect, useState } from "react";
import { MdPhotoCamera } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Friend from "@/components/Account/friend";
import iUser from "@/interface/userType";
import LoadingPage from "./Modal/LoadingPage";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import ImageWithSkeleton from "./SideBar/image";
import EditDialog from "./SideBar/EditDialog";
import AlertDialogDemo from "./Modal/AlertDialog";
import iFriend from "@/interface/friendType";
import PostFeed from "./PostFeed";
import CommentFeed from "./CommentFeed";
import Link from "next/link";
interface SidebarProps {
  userInfo: iUser;
  id: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userInfo, id }) => {
  const [user, setUser] = useState<iUser>(userInfo);
  const [userForm, setUserForm] = useState<iUser>(userInfo);
  const [loading, setLoading] = useState(false);
  const isOwner = id == String(userInfo.id);
  const [change, setChange] = useState(false);
  const [isFollow, setIsFollow] = useState(false); //Trạng thái nút accept ảnh
  const [isStatusFriend, setIsStatusFriend] = useState<number>(1); //Trạng thái nút kết bạn
  const [pendingFriend, setPendingFriend] = useState<iFriend[]>(); //Danh sách chờ kết bạn
  const [friend, setFriend] = useState<iFriend[]>(); //Danh sách bạn bè
  const [posAccept, setPosAccept] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "userAvatar");

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME!;
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = "";

    try {
      setLoading(true);
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }
      console.log("Chạy", imageUrl);
      await axios.put(`/api/account/${userInfo.username}`, {
        profile_picture: imageUrl,
      });
      setUser({ ...user, profile_picture: imageUrl });
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/api/account/${userInfo.username}`, {
        bio: user.bio,
        location: user.location,
        name: user.name,
      });
      setLoading(false);
      toast.success("Thay đổi dữ liệu thành công!");
    } catch (error) {
      setLoading(false);
    }
  };
  const handleFollow = async () => {
    setIsFollow(true);
    try {
      const response = await axios.post("/api/follow", {
        followed_id: user.id,
      });
      console.log("Chạy");
    } catch (error) {
      console.log("Lỗi: ", error);
    }
  };

  const handleUnFollow = async () => {
    setIsFollow(false);
    try {
      await axios.delete("/api/follow", {
        params: { followed_id: user.id },
      });
      console.log("Chạy");
    } catch (error) {
      console.log("Lỗi: ", error);
    }
  };

  const handleFriend = async () => {
    try {
      const response = await axios.post("/api/friends/add", {
        friend_id: user.id,
      });
      if (response.data.message == 1) {
        toast.success("Thêm bạn bè thành công. Đang chờ chấp nhận!");
        setIsStatusFriend(response.data.message);
      } else toast.error("Lỗi kết bạn");
    } catch (error) {
      console.log("Lỗi", error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/friends/${user.id}`);
      toast.success("Đã xóa bạn bè thành công!");
      setIsStatusFriend(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Lỗi khi remove friend: ", error);
    }
  };

  useEffect(() => {
    const checkFollow = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/follow", {
          params: { followed_id: user.id },
        });
        setIsFollow(response.data.is_following);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Lỗi:", error);
      }
    };
    const checkFriend = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/friends", {
          params: { friend_id: user.id },
        });
        setIsStatusFriend(response.data.status);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Lỗi:", error);
      }
    };
    const getPendingFriendList = async () => {
      const response = await axios.get("/api/friends/pendingList");
      console.log("Chạy", response.data.pending_friends);
      setPendingFriend(response.data.pending_friends);
    };
    const getFriendList = async (id: string) => {
      const response = await axios.get("/api/friends/friendList", {
        params: { friend_id: id },
      });
      console.log("Chạy friend", response.data.friends);
      setFriend(response.data.friends);
    };
    if (!isOwner) {
      checkFollow();
      checkFriend();
      getFriendList(String(user.id));
    } else {
      getPendingFriendList();
      getFriendList(id);
    }
  }, [isOwner, user.id]);
  useEffect(() => {
    setUserForm(user);
  }, [user]);
  useEffect(() => {
    if (change) {
      handleSubmit();
      setChange(false);
    }
  }, [change]);
  useEffect(() => {
    const handlePosAccept = async () => {
      const response = await axios.put("/api/friends/acceptFriend", {
        friend_id: posAccept,
      });
      setPendingFriend(
        pendingFriend?.filter((friend) => friend.id !== posAccept)
      );
      setPosAccept("");
      toast.success("Chấp nhận bạn thành công");
    };

    if (posAccept) handlePosAccept();
  }, [posAccept]);
  return (
    <div className="relative">
      {loading && <LoadingPage isError={loading} />}
      <ImageWithSkeleton
        src={
          previewUrl ?? user.profile_picture ?? "https://github.com/shadcn.png"
        }
        alt="demo"
        className="mt-10 mx-auto absolute w-300 h-100 z-0"
        imgClass="rounded-lg"
      />
      <div className="-mt-25 z-10">
        <div className="grid grid-cols-3 max-w-240 wrap mx-auto gap-2 h-50 mb-4">
          <div className={`m-auto relative col-span-1`}>
            <ImageWithSkeleton
              src={
                previewUrl ??
                user.profile_picture ??
                "https://github.com/shadcn.png"
              }
              alt="demo"
              className="w-50 h-50 "
              imgClass="rounded-full"
            />

            {isOwner &&
              (!previewUrl ? (
                <label
                  className="absolute right-0 top-5/6 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  htmlFor="file-upload"
                >
                  <MdPhotoCamera size={20} />
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <Button
                  className="absolute right-0 top-5/6 transform -translate-y-1/2  rounded-full p-2 shadow-md bg-green-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitImage(
                      e as unknown as React.FormEvent<HTMLFormElement>
                    );
                  }}
                >
                  Accept
                </Button>
              ))}
          </div>
          <div className="relative rounded col-span-2 p-4 grid grid-rows-3 gap-5 bg-white shadow-[0px_0px_8px_1px_gray] h-50 ">
            <div className="row-span-1 flex">
              <div className="justify-self-start">
                <div className="text-2xl font-bold">
                  {user.name} <i>({user.username})</i>
                </div>{" "}
                {user.count_follower} followers | {user.count_friend} friends |
                Following: {user.count_follow}
              </div>
              {!isOwner && (
                <div className="flex gap-3 ml-auto ">
                  {isFollow ? (
                    <Button
                      className="hover:cursor-pointer bg-green-500 hover:bg-green-600"
                      onClick={handleUnFollow}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button
                      className="hover:cursor-pointer"
                      onClick={handleFollow}
                    >
                      Follow
                    </Button>
                  )}
                  {isStatusFriend == 1 ? (
                    <Button className=" bg-blue-400 hover:bg-blue-400">
                      PendingFriend
                    </Button>
                  ) : isStatusFriend == 2 || isStatusFriend == 6 ? (
                    <AlertDialogDemo
                      btn={
                        <Button className="hover:cursor-pointer bg-red-400 hover:bg-red-500">
                          RemoveFriend
                        </Button>
                      }
                      title1="Xóa bạn bè"
                      title2="Xóa bạn bè không thể hoàn lại thao tác. Bạn có chắc chắn muốn xóa không?"
                      onSave={handleRemoveFriend}
                    />
                  ) : isStatusFriend == 5 ? (
                    <Button
                      className="hover:cursor-pointer bg-yellow-400 hover:bg-yellow-500"
                      onClick={() => setPosAccept(String(user.id))}
                    >
                      AcceptFriend
                    </Button>
                  ) : isStatusFriend == 7 ? (
                    <Button className=" bg-violet-400 hover:bg-violet-500">
                      BlockedFriend
                    </Button>
                  ) : isStatusFriend == 3 ? (
                    <Button className=" bg-orange-400 hover:bg-orange-500">
                      BlockingFriend
                    </Button>
                  ) : (
                    <Button
                      className="hover:cursor-pointer hover:bg-black-300"
                      onClick={handleFriend}
                    >
                      AddFriend
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-rows-5 gap-6">
              <div className="text-sm row-span-1 flex gap-2">
                <div className="font-bold">Location:</div>
                <span className="wrap-anywhere">{user.location}</span>
                <i>{user.location ? " " : "Chưa có thông tin"}</i>
              </div>
              <div className="text-sm row-span-4 flex gap-2">
                <div className="font-bold">Bio:</div>
                <span className="wrap-anywhere">{user.bio}</span>
                <i>{user.bio ? " " : "Chưa có thông tin"}</i>
              </div>
            </div>
            {/* Edit Profile Dialog */}
            <EditDialog
              data={userForm}
              onSave={(updatedData) => {
                setUser(updatedData as iUser);
                setChange(true);
              }}
              open={isOwner}
            />
          </div>
        </div>
        {/* Bạn bè */}
        <div className="relative my-10 flex gap-3">
          <div className="h-100 ml-40">
            <Friend
              onSave={(id: string) => setPosAccept(id)}
              data={pendingFriend} //Danh sách chờ kết bạn
              dataFriend={friend}
              open={isOwner}
            />
          </div>
          <div className="border-t-2 pt-2">
            <PostFeed
              onSelectPost={setSelectedPostId}
              userOwner={String(user.id)}
              setShowModal={setShowModal}
              isOnAccountPage={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
