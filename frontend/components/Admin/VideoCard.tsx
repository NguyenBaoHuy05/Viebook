import React from "react";
interface VideoCardProp {
  title: string;
  description: string;
}
function VideoCard({ title, description }: VideoCardProp) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {title}
        </h3>
      )}
      <div className="relative w-full mb-4 rounded-md overflow-hidden">
        <iframe
          width="1028"
          height="422"
          src="https://www.youtube.com/embed/l7wqc0qz2ag"
          title="EM LÀ LY CÀ PHÊ ~ NHẠC BALLAD CỰC HAY | CHILLFRIEND"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default VideoCard;
