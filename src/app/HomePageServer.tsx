import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CustomizedButton } from "../components/ui/customized-button/CustomizedButton";
import { ICategory } from "../stores/CategoryStore";
import { Loader } from "../components/loader/Loader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IProduct } from "../stores/ProductStore";
import ReviewsComponent from "../components/reviews/reviews.component";
import Awards from "../components/awards/Awards";
import Hero from "../components/hero/Hero";
import CreativeVision from "../components/creative-vision/CreativeVision";
import RingsCollection from "../components/rings-collection/RingsCollection";

const defaultCategoryImage = "/image/default-category-img.jpg";

const HomePageServer = ({
  categories,
  loadingCategories,
  bestSellingProducts,
}: {
  categories: ICategory[];
  loadingCategories: boolean;
  bestSellingProducts: IProduct[];
}) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen">
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= AWARDS ================= */}
      <Awards />

      {/* ================= STATIC CATEGORIES ================= */}
      <section className="py-12 px-6" style={{ backgroundColor: "#F5F3EFCC" }}>
        <div className="flex justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            {
              href: "/products/necklace",
              src: "/image/necklace-homepage-card.png",
              alt: "Necklace",
            },
            {
              href: "/products/rings",
              src: "/image/rings-homepage-card.png",
              alt: "Rings",
            },
            {
              href: "/products/earrings",
              src: "/image/earrings-homepage-card.png",
              alt: "Earrings",
            },
          ].map(({ href, src, alt }) => (
            <Link
              key={alt}
              href={href}
              className="relative block w-1/3 aspect-[3/4] overflow-hidden group transition-all duration-300 hover:-translate-y-2"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CREATIVE VISION ================= */}
      <CreativeVision />

      {/* ================= OUR RINGS COLLECTION ================= */}
      <RingsCollection />

      {/* ================= CATEGORIES GRID + REVIEWS ================= */}
      <section className="px-4 lg:px-14 text-center flex flex-col" style={{ backgroundColor: "#F5F3EFCC" }}>
        {/* Categories */}
        {loadingCategories ? (
          <div className="w-full flex justify-center py-6">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 sm:px-4 pt-6 pb-2">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/products/${category.name.toLowerCase()}`}
                className="relative block w-full aspect-square transition-transform duration-300 ease-in-out md:hover:scale-105 md:hover:shadow-2xl group"
              >
                <Image
                  src={category.images[0]?.imgUrl ?? defaultCategoryImage}
                  alt={category.name}
                  fill
                  quality={100}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                <p className="absolute w-[90%] font-amandine tracking-wide text-lg sm:text-sm md:text-base lg:text-lg bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Reviews — directly touching categories */}
        <div className="pt-2 pb-6">
          <ReviewsComponent />
        </div>
      </section>
    </div>
  );
};

export default HomePageServer;