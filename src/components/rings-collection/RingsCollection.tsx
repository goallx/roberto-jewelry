import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const RingsCollection = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);
  
  // Detect if current language is RTL
  useEffect(() => {
    setIsRTL(i18n.language === 'he');
  }, [i18n.language]);

  const ringsCollection = [
    {
      href: "/products/rings/ring1",
      src: "/image/eternal-diamond-ring.jpg",
      altKey: "ringsCollection.eternalDiamondRing.alt",
      price: "$2,500",
      descriptionKey: "ringsCollection.eternalDiamondRing.description",
    },
    {
      href: "/products/rings/ring2",
      src: "/image/classic-gold-necklace.jpg",
      altKey: "ringsCollection.classicGoldNecklace.alt",
      price: "$1,800",
      descriptionKey: "ringsCollection.classicGoldNecklace.description",
    },
    {
      href: "/products/rings/ring3",
      src: "/image/elegant-tennis-bracelet.jpg",
      altKey: "ringsCollection.elegantTennisBracelet.alt",
      price: "$3,200",
      descriptionKey: "ringsCollection.elegantTennisBracelet.description",
    },
    {
      href: "/products/earrings/earrings1",
      src: "/image/diamond-drop-earrings.jpg",
      altKey: "ringsCollection.diamondDropEarrings.alt",
      price: "$1,500",
      descriptionKey: "ringsCollection.diamondDropEarrings.description",
    },
  ];

  return (
    <section 
      className="pt-16 pb-6 px-6 lg:px-20 text-center flex flex-col gap-8"
      style={{ backgroundColor: "#F5F3EFCC" }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">
        {t('ringsCollection.title', 'Our Rings Collection')}
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-8 text-base leading-relaxed">
        {t('ringsCollection.description', 'Discover our most beloved pieces, each crafted with exceptional attention to detail and timeless design.')}
      </p>
      
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 px-4 sm:px-0">
        {ringsCollection.map(({ href, src, altKey, price, descriptionKey }, index) => (
          <Link
            key={index}
            href={href}
            className="relative block aspect-square shadow-lg group"
          >
            {/* Wishlist Heart Icon */}
            <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10 w-8 h-8 bg-white border border-gray-300 flex items-center justify-center cursor-pointer group-hover:bg-gray-100 transition-colors`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.613 0-2.927 1.004-3.312 2.36a3.616 3.616 0 00-3.312-2.36C5.1 3.75 3 5.765 3 8.25c0 4.082 7.5 10.5 9 10.5s9-6.418 9-10.5z"
                />
              </svg>
            </div>

            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={t(altKey)}
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>

            {/* Text info container */}
            <div className={`h-[88px] mt-3 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-base font-medium text-gray-900">{t(descriptionKey)}</p>
              <p className="text-orange-600 text-xl font-semibold mt-0.5">{price}</p>
            </div>
          </Link>
        ))}
      </div>

      <button className="mt-10 mx-auto px-8 py-3 bg-black text-white font-semibold max-w-xs hover:bg-gray-900 transition-colors">
        {t('ringsCollection.viewAllButton', 'View All Collections')} &rarr;
      </button>
    </section>
  );
};

export default RingsCollection;