"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BestSelling() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // All 7 best selling images
  const bestSellingImages = [
    "/image/best-selling1.jpg",
    "/image/best-selling2.jpg",
    "/image/best-selling3.jpg",
    "/image/best-selling4.jpg",
    "/image/best-selling5.jpg",
    "/image/best-selling6.jpg",
    "/image/best-selling7.jpg",
  ];

  const totalImages = bestSellingImages.length;
  const visibleCount = 3;

  const nextSlide = () => {
    if (currentIndex < totalImages - visibleCount) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="py-10 px-4 text-center">
      <h2 className="font-amandine text-2xl font-bold text-gray-800 mb-6">
        Best Selling Items
      </h2>

      <div className="relative w-full mx-auto">
        {/* Carousel viewport with equal side spacing */}
        <div className="overflow-hidden w-full h-[450px] relative mb-4">
          <motion.div
            className="flex"
            animate={{ 
              x: `-${(currentIndex * 100) / (visibleCount + 0.15)}%`,
            }}
            transition={{ type: "tween", duration: 0.6 }}
          >
            {bestSellingImages.map((img, i) => {
              const position = i - currentIndex;
              const isCenter = position === 1;
              
              return (
                <div
                  key={i}
                  className="relative flex-shrink-0 h-[450px] flex items-center justify-center px-3"
                  style={{ 
                    width: `${100 / (visibleCount + 0.15)}%`,
                    minWidth: `${100 / (visibleCount + 0.15)}%`,
                    marginLeft: i === 0 ? '30px' : '0',
                    marginRight: i === totalImages - 1 ? '30px' : '0'
                  }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      scale: isCenter ? 1.05 : 0.95,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={img}
                      alt={`Best Selling ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Controls - back to original design */}
        <div className="flex items-center justify-center gap-6 text-3xl font-bold select-none">
          <button
            onClick={prevSlide}
            className={`${
              currentIndex === 0 ? "text-gray-200" : "text-gray-400 hover:text-gray-600"
            } transition-colors`}
            disabled={currentIndex === 0}
          >
            &lt;
          </button>
          <span className="text-black text-xl">●</span>
          <button
            onClick={nextSlide}
            className={`${
              currentIndex >= totalImages - visibleCount
                ? "text-gray-200"
                : "text-gray-400 hover:text-gray-600"
            } transition-colors`}
            disabled={currentIndex >= totalImages - visibleCount}
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}