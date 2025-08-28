'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloseOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useInView } from "framer-motion";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: (e: any) => void;
  priority?: boolean;
  quality?: number;
  objectFit?: string;
  loading?: "eager" | "lazy";
  role?: string;
  showZoomBtn?: boolean;
  isSelected?: boolean
}

const fallbackBlurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABp0lEQVR42mJ8+vTxfwYKAOKb7WwQAbyZoBGK9Mb0jsjY0NBQAEjjPz9+h3Tt39+S4l7/8xyOXkPzNGJxI5MwMC2c6X2qD/q9ZPgb3/d3cXl2fP3zJABZHmYGPPhC3bvL3uHn//du4e9zD5UABDRmYmDL//f2PNxu8/cfMIMVGoHLmjciAJcJLP3IwpXt3+zjOxsZOPFj1GwWIV6PxqKh0yKCh8x+PPHkmXuXMikBxaExMTwp/JXHyh6dF2bi9OLh45dy5c2DqaHNBCCNxCA1k5+GThw8TF1fgmQX42SA2O+Lhc1mzs9Pd0y/evXrhTzJwcJHa+fNm2V8euX5+OjPTl35pgHgADo+gVV0KoFHIYCAhKMZmB9ixj8AygQUaLkyUzAicPBx+PvjKwcHLJX7zH+/ftHrAYcnNzN8nsG53/K0IBbB5li7dnX7t2PF+4ePj9J3b9mBBqA6fUxdJRGhWV9+/e7WhUq7tYtWLnzJhBo9+fIkW/Tx+MjXz8MIAQNGfBiYuJi3/YhgeCjOHZ7syKVw1c9qhc6e69ZtHIpC+QIiIu4KhQoEH+ZExw+Gyz+/Xr1wmcTskNiJiMLugDiBrONnDP2FzQAAAABJRU5ErkJggg==";

const clearOldCache = () => {
  const CACHE_EXPIRATION = 1 * 60 * 60 * 1000;
  const lastCleanup = localStorage.getItem("lastCleanup");

  if (lastCleanup && Date.now() - parseInt(lastCleanup, 10) < CACHE_EXPIRATION) {
    return;
  }

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("blur-")) {
      localStorage.removeItem(key);
    }
  });

  localStorage.setItem("lastCleanup", Date.now().toString());
};

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className = "",
  onClick,
  priority = false,
  quality,
  objectFit = "cover",
  loading = "eager",
  role,
  showZoomBtn = false,
  isSelected = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    clearOldCache();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className} w-full aspect-square`}
      style={{ overflow: "hidden" }}
    >
      {showImageModal && src && (
        <ImageModal src={src} alt={alt} onClose={() => setShowImageModal(false)} />
      )}
      {showZoomBtn && (
        <FullscreenOutlined
          onClick={() => setShowImageModal(true)}
          className="absolute top-4 right-4 p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors cursor-pointer z-10"
          aria-label="Zoom image"
        />
      )}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{ backgroundSize: "200% 100%", backgroundPosition: "left center" }}
        />
      )}
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          className={`
          transition-all duration-500 ease-in-out 
          ${isLoaded ? "opacity-100" : "opacity-0"} 
          ${onClick ? "cursor-pointer" : ""} 
          ${isSelected
              ? "ring-4 border-yellow-400 ring-offset-2 ring-offset-white drop-shadow-lg scale-110"
              : "ring-0"
            }
        `}
          onClick={onClick}
          priority={priority}
          role={role ?? undefined}
          objectFit={objectFit}
          placeholder="blur"
          blurDataURL={fallbackBlurDataURL}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{ backgroundSize: "200% 100%", backgroundPosition: "left center" }}
        />
      )}
    </div>
  );
};

const ImageModal = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300">
      <CloseOutlined
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
        aria-label="Close modal"
      />
      <div className="w-full h-full p-4 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1000}
          priority
          quality={100}
          className="object-contain max-w-full max-h-full"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
    </div>
  );
};
