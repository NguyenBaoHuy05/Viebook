"use client";
import PostFeed from "@/components/PostFeed";
import Share from "@/components/Share";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import PopoverChat from "@/components/PopoverChat";
function Page() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { userId } = useUser();
  return (
    <div className="mt-25">
      <Share
        showModal={showModal}
        setShowModal={setShowModal}
        postID={selectedPostId}
      />
      <div className="w-full grid grid-cols-4">
        <div className="col-span-1"></div>
        <PostFeed
          onSelectPost={setSelectedPostId}
          setShowModal={setShowModal}
          userOwner={String(userId)}
          isOnAccountPage={false}
        />
      </div>
    </div>
  );
}

export default Page;
