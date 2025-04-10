import Image from "next/image";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import iPost from "@/app/interfaces/post";
function Post({ post }: { post: iPost }) {
  return (
    <div className="grid grid-cols-8">
      <div className="bg-gray-100 pt-2 col-span-7">
        <div className="flex items-center gap-2 px-2">
          <Image
            src={post.logo}
            width={35}
            height={35}
            sizes="35"
            alt="avatar"
            className="rounded-full object-cover w-10 h-10"
          />
          <div className="flex flex-col">
            <span>{post.name}</span>
            <span>{post.date}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="pl-2">{post.title}</span>
          <div className="flex">
            <div className="w-full max-h-[600px] min-h-[500px] relative">
              <Image
                src={post.content}
                alt="content"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-2 flex flex-col justify-center items-center gap-8 ">
        <div className=" rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer p-4">
          <AiFillLike size={32} />
        </div>
        <div className=" rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer p-4">
          <FaCommentAlt size={25} />
        </div>
        <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer p-4 rounded-full">
          <FaShare size={28} />
        </div>
      </div>
    </div>
  );
}

export default Post;
