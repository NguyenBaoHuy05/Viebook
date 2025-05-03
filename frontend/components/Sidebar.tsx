"use client";
import React, { useEffect, useState } from "react";
import { MdPhotoCamera } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Friend } from "@/components/Account/friend";
import iUser from "@/interface/userType";
import LoadingPage from "./Modal/LoadingPage";
import axios from "@/lib/axiosConfig";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log("link: ", previewUrl);
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
  useEffect(() => {
    setUserForm(user);
  }, [user]);
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
      setLoading(true);
    }
  };
  useEffect(() => {
    if (change) {
      handleSubmit();
      setChange(false);
    }
  }, [change]);
  if (loading) return <LoadingPage isError={loading} />;
  return (
    <div className="mt-25 ">
      <div className="grid grid-cols-3 max-w-240 wrap mx-auto gap-2 h-50 mb-4">
        <div
          className={`m-auto relative col-span-1 p-4 grid grid-rows-6 rounded-full w-50 h-50  bg-cover bg-center `}
          style={{
            backgroundImage: `url(${
              previewUrl ||
              user.profile_picture ||
              "https://github.com/shadcn.png"
            })`,
          }}
        >
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
        <div className="relative rounded col-span-2 p-4 grid grid-rows-2 gap-3 bg-white shadow-[0px_0px_8px_1px_gray] h-50">
          <div className="row-span-1 flex">
            <div className="justify-self-start">
              <div className="text-2xl font-bold">
                {user.name} <i>({user.username})</i>
              </div>{" "}
              {user.count_follow} followers | {user.count_friend} friends
            </div>
            {!isOwner && (
              <div className="flex gap-3 ml-auto ">
                <Button className="hover:cursor-pointer">Follow</Button>
                <Button className="hover:cursor-pointer">AddFriend</Button>
              </div>
            )}
          </div>
          <div className="grid grid-rows-3">
            <div className="text-sm row-span-1 flex gap-2">
              <div className="font-bold">Location:</div>
              {user.location}
              <i>{user.location ? " " : "Bạn chưa nhập thông tin"}</i>
            </div>
            <div className="text-sm row-span-1 flex  gap-2">
              <div className="font-bold">Bio:</div>
              {user.bio}
              <i>{user.bio ? " " : "Bạn chưa nhập thông tin"}</i>
            </div>
          </div>
          {/* Edit Profile Dialog */}
          {isOwner && (
            <Dialog>
              <DialogTrigger asChild onClick={(e) => setUserForm({ ...user })}>
                <div
                  className="absolute right-1/50 -top-4 border-2 border-dashed 
                 bg-white rounded-full p-2 shadow-md
                 hover:cursor-pointer hover:rotate-12 hover:border-solid hover:border-blue-300"
                >
                  <CiViewList size={20} />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={userForm.name ?? ""}
                      className="col-span-3"
                      onChange={(e) => {
                        setUserForm({ ...userForm, name: e.target.value });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={userForm.username}
                      className="col-span-3"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={userForm.location ?? ""}
                      className="col-span-3"
                      onChange={(e) => {
                        setUserForm({ ...userForm, location: e.target.value });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      value={userForm.bio ?? ""}
                      className="col-span-3"
                      onChange={(e) => {
                        setUserForm({ ...userForm, bio: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      setUser({ ...userForm });
                      setChange(true);
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {/* Bạn bè */}
      <div className="relative border-t-2 border-gray-700 pt-8 pb-5 max-w-240 mx-auto h-60 mt-20 mb-10 ">
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-7 border-2 border-solid
               bg-white rounded-md py-2 px-3 shadow-md
                hover:scale-105  hover:border-blue-300"
        >
          Danh sách bạn bè
        </div>
        <Friend />
      </div>
      <div className="bg-gray-200 max-w-240 mx-auto h-50">Bài Post</div>
    </div>
  );
};

export default Sidebar;
