"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import CreatePost from "./CreatePost";

function CreateAPost() {
  const [load, setLoad] = useState(false);
  console.log(load);
  const toggleLoad = () => {
    setLoad(!load);
  };
  return (
    <div>
      <CreatePost load={load} toggleLoad={toggleLoad} />
      <div className="bg-gray-50 p-4 shadow-sm rounded-xl">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="avt" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            className="flex-1 rounded-full px-4 py-2 border-2 hover:bg-white shadow-sm cursor-pointer text-gray-500"
            onClick={toggleLoad}
          >
            Hãy cho mọi người biết suy nghĩ của bạn
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAPost;
