import Post from "@/components/Post";
import { title } from "process";
function page() {
  return (
    <div className="mt-25">
      <div className="grid grid-cols-3">
        <div className="col-span-1">a</div>
        <div className="col-span-1">
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
  );
}

export default page;
