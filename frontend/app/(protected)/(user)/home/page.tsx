"use client";
import PostFeed from "@/components/PostFeed";
import CommentFeed from "@/components/CommentFeed";
import { useState } from "react";

function Page() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  return (
    <div className="mt-25">
      <div className="grid grid-cols-4 ">
        <div className="col-span-1"></div>
        <div className="flex col-span-3">
          <PostFeed onSelectPost={setSelectedPostId} />
        </div>
      </div>
    </div>
  );
}

export default Page;
