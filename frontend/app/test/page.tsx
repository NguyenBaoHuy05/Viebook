import Post from "@/components/Post";
import Header from "@/components/Header";
import { title } from "process";
import CreateAPost from "@/components/CreateAPost";
function page() {
  return (
    <>
      <Header />

      <div className="mt-25">
        <div className="grid grid-cols-4">
          <div className="col-span-1">a</div>
          <div className="col-span-2 flex flex-col gap-8">
            <CreateAPost />
            <Post
              post={{
                name: "Con dog",
                logo: "/avt.jpg",
                title: "I am too handsome",
                content: "/avt.jpg",
                commentCount: 10,
                reactCount: 10,
                shareCount: 4,
                date: "5/4/2025",
              }}
            />
          </div>

          <div className="col-span-1">c</div>
        </div>
      </div>
    </>
  );
}

export default page;
