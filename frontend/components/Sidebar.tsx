import React from "react";
import { MdPhotoCamera } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Friend } from "@/components/Account/friend";
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

export default function Sidebar() {
  return (
    <div className="mt-25">
      <div className="grid grid-cols-3 max-w-240 wrap mx-auto gap-2 h-50 mb-4">
        <div className="m-auto relative col-span-1 p-4 grid grid-rows-6 rounded-full w-50 h-50 bg-[url(https://github.com/shadcn.png)] bg-cover bg-center ">
          <div className="absolute right-0 top-5/6 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
            <MdPhotoCamera size={20} />
          </div>
        </div>
        <div className="relative rounded col-span-2 p-4 grid grid-rows-2 gap-3 bg-white shadow-[0px_0px_8px_1px_gray] h-50">
          <div className="row-span-1">
            <div className="text-2xl font-bold">
              Phan Tuấn Khang <i>(Khang Idol)</i>
            </div>{" "}
            10 followers | 9 friends
          </div>
          <div className="grid grid-rows-3">
            <div className="text-sm row-span-1 flex gap-2">
              <div className="font-bold">Location:</div>
              Đại học Sư phạm TP.HCM (HCMUE)
            </div>
            <div className="text-sm row-span-1 flex  gap-2">
              <div className="font-bold">Bio:</div>
              Chuyên gia trong việc coding, sáng tạo, chuyên gia AI và thông
              thạo tất cả các công nghệ
            </div>
          </div>
          {/* Edit Profile Dialog */}
          <Dialog>
            <DialogTrigger asChild>
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
                    value="Phan Tuấn Khang"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value="Khang Idol"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value="Đại học Sư phạm TP.HCM (HCMUE)"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    value="Chuyên gia trong việc coding, sáng tạo, chuyên gia AI và thông thạo tất cả các công nghệ"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
}
