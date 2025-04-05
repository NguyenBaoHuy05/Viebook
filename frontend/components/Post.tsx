import Image from "next/image";
interface iPost {
  name: string;
  logo: string;
  title: string;
  content: string;
  commentCount: number;
  reactCount: number;
  shareCount: number;
  date: string;
}
function Post({ post }: { post: iPost }) {
  return (
    <div className="bg-gray-100 py-2 rounded-xl">
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
  );
}

export default Post;
