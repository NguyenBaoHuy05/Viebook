import axios from "@/lib/axiosConfig";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdPhotoLibrary } from "react-icons/md";
import { Globe2, Users, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const privacyOptions = [
  {
    label: "Công khai",
    value: "public",
    icon: <Globe2 className="h-4 w-4 mr-1" />,
  },
  {
    label: "Bạn bè",
    value: "friends",
    icon: <Users className="h-4 w-4 mr-1" />,
  },
  {
    label: "Riêng tư",
    value: "private",
    icon: <Lock className="h-4 w-4 mr-1" />,
  },
];

function CreatePost({
  load,
  toggleLoad,
}: {
  load: boolean;
  toggleLoad: () => void;
}) {
  const [data, setData] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("public");
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  if (!load) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Phân tích hình ảnh và gợi ý tiêu đề
      setSuggestedTitle("");
      setAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:8001/analyze-image/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setSuggestedTitle(data.vietnamese_title);
      } catch {
        setSuggestedTitle("Không thể gợi ý tiêu đề.");
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "userAvatar");
    formData.append("cloud_name", "diwza80p2");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/diwza80p2/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = "";

    try {
      setUploading(true);
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      await axios.post(
        "/api/posts",
        {
          typeContent: "image_post",
          title: data,
          content: imageUrl,
          privacy,
        },
        { withCredentials: true }
      );

      setData("");
      setImage(null);
      setPreviewUrl(null);
      setPrivacy("public");
      toggleLoad();
      window.location.reload();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          <div>Create a Post</div>
          <button
            onClick={toggleLoad}
            className="text-gray-600 hover:text-black hover:scale-125 cursor-pointer"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="text"
            placeholder="Hãy cho mọi người biết suy nghĩ của bạn"
            className="w-full border p-3 rounded-md resize-none min-h-[100px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setData(e.target.value)}
            value={data}
          />

          {analyzing && (
            <Alert className="mb-3 border-blue-200 bg-blue-50 flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5 text-blue-400" />
              <AlertDescription>Đang gợi ý tiêu đề...</AlertDescription>
            </Alert>
          )}

          {suggestedTitle && (
            <Alert className="mb-3 border-green-200 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle>
                <Badge
                  variant="outline"
                  className="text-green-700 border-green-300 bg-green-100 mr-2"
                >
                  Gợi ý tiêu đề
                </Badge>
              </AlertTitle>
              <AlertDescription>
                <span className="text-green-800 font-medium">
                  {suggestedTitle}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="ml-3 cursor-pointer hover:bg-green-300"
                    onClick={() => setData(suggestedTitle)}
                    title="Chèn tiêu đề này vào bài viết"
                    type="button"
                  >
                    Dùng tiêu đề này
                  </Button>
                </span>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mb-2">
            {privacyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrivacy(option.value)}
                className={`flex items-center px-3 py-1 rounded-full border transition ${
                  privacy === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
          <div>
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded-md w-full object-cover max-h-60"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                    setSuggestedTitle("");
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                >
                  <IoMdClose className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 cursor-pointer p-3 rounded-md text-gray-600 justify-center"
              >
                <MdPhotoLibrary className="text-2xl text-green-500" />
                <span>Add Photo</span>
              </label>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
