'use client'
import { useStores } from "@/context/StoreContext";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Wishlist = observer(() => {
  const { t, i18n } = useTranslation();
  const { wishlistStore, cartStore } = useStores();
  const router = useRouter();
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    wishlistStore?.fetchWishlist();
  }, [wishlistStore]);

  const handleViewProduct = (productId: string) => {
    router.push(`/collections/${productId}`);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await cartStore?.addToCart(productId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-[#f5f5f5] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-6">
          {t("wishlist.title")}
        </h2>

        {wishlistStore?.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t("wishlist.empty")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {wishlistStore?.items.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 text-center flex flex-col"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => wishlistStore.removeFromWishlist(item.id)}
                    className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} 
                      bg-transparent p-1 text-red-500 hover:text-red-600`}
                    aria-label={t("wishlist.removeItem")}
                  >
                    <FaHeart />
                  </button>

                  {/* Product Image */}
                  <img
                    src={item.product.images?.[0].imgUrl ?? ""}
                    alt={item.product.name}
                    className="w-full h-32 object-cover rounded-t-xl cursor-pointer"
                    onClick={() => handleViewProduct(item.product_id)}
                  />

                  {/* Product Info */}
                  <div className="p-2 flex flex-col flex-grow">
                    <h3
                      className="text-sm font-medium text-[#333333] mb-1 cursor-pointer"
                      onClick={() => handleViewProduct(item.product_id)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {item.product.description}
                    </p>
                    <span className="text-sm font-semibold text-gray-800 mb-3">
                      ${item.product.price}
                    </span>

                    <button
                      onClick={() => handleAddToCart(item.product_id)}
                      className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-900"
                    >
                      {t("wishlist.addToCart", "Add to Cart")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More */}
            {/* <div className="flex justify-center mt-8">
              <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-900">
                {t("wishlist.showMore")}
              </button>
            </div> */}
          </>
        )}
      </div>
    </section>
  );
});

export default Wishlist;
