import axios from "@/lib/axiosConfig";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

function CreatePost({
  load,
  toggleLoad,
}: {
  load: boolean;
  toggleLoad: () => void;
}) {
  if (!load) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/posts",
        {
          typeContent: "test",
          title: data,
          content: "",
        },
        {
          withCredentials: true,
        }
      );
      toggleLoad();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };
  const [data, setData] = useState("");
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          <div> Create a Post</div>
          <button
            onClick={toggleLoad}
            className="text-gray-600 hover:text-black hover:scale-125"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            name="text"
            placeholder="Hãy cho mọi người biết suy nghĩ của bạn"
            className="w-full border p-2 rounded mb-4 resize-none min-h-40 border-none focus:outline-none"
            onChange={(e) => setData(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
