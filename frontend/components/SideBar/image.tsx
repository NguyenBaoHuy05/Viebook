import { useState } from "react";

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  imgClass,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClass?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 ${imgClass} bg-gray-300 animate-pulse`}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full ${imgClass} object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
