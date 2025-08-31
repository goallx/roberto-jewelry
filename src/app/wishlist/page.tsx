'use client'
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";

interface WishlistItem {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

const initialWishlistItems: WishlistItem[] = [
  {
    id: 1,
    title: "classicDiamondRing",
    description: "classicDiamondRingDesc",
    price: "$2,500",
    image: "/images/classicDiamondRing.png",
  },
  {
    id: 2,
    title: "elegantGoldNecklace",
    description: "elegantGoldNecklaceDesc",
    price: "$1,800",
    image: "/images/elegantGoldNecklace.png",
  },
  {
    id: 3,
    title: "diamondDropEarrings",
    description: "diamondDropEarringsDesc",
    price: "$950",
    image: "/images/diamondDropEarrings.png",
  },
  {
    id: 4,
    title: "tennisBracelet",
    description: "tennisBraceletDesc",
    price: "$1,200",
    image: "/images/tennisBracelet.png",
  },
  {
    id: 5,
    title: "pearlDropNecklace",
    description: "pearlDropNecklaceDesc",
    price: "$1,500",
    image: "/images/pearlDropNecklace.png",
  },
];

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="bg-[#f5f5f5] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-6">
          {t("wishlist.title")}
        </h2>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t("wishlist.empty")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 text-center"
                >
                  {/* Heart Icon */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className={`absolute top-2 ${
                      isRTL ? "left-2" : "right-2"
                    } bg-transparent p-1 text-red-500 hover:text-red-600`}
                    aria-label={t("wishlist.removeItem")}
                  >
                    <FaHeart />
                  </button>

                  <img
                    src={item.image}
                    alt={t(`wishlist.products.${item.title}`)}
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-[#333333] mb-1">
                      {t(`wishlist.products.${item.title}`)}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {t(`wishlist.products.${item.description}`)}
                    </p>
                    <span className="text-sm font-semibold text-gray-800">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            <div className="flex justify-center mt-8">
              <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-900">
                {t("wishlist.showMore")}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Wishlist;