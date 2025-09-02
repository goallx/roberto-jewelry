import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  imageSrc: string;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageSrc, href }) => {
  return (
    <Link
      href={href}
      className="relative block w-full aspect-[3/4] overflow-hidden group transition-all duration-300 hover:-translate-y-2 pb-6"
    >
      <div className="relative h-full w-full transition-all duration-500 group-hover:scale-105">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity group-hover:bg-opacity-20"></div>
      </div>
    </Link>
  );
};

const JewelryShowcase: React.FC = () => {
  const categories = [
    {
      title: "Necklaces",
      imageSrc: "/image/necklace-homepage-card.png",
      href: "/products/necklace"
    },
    {
      title: "Earrings",
      imageSrc: "/image/earrings-homepage-card.png",
      href: "/products/earrings"
    },
    {
      title: "Rings",
      imageSrc: "/image/rings-homepage-card.png",
      href: "/products/rings"
    }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-10 max-w-7xl mx-auto pt-12 pb-16 px-4">
      {categories.map((category, index) => (
        <div key={index} className="w-full md:w-1/3 px-3">
          <CategoryCard
            title={category.title}
            imageSrc={category.imageSrc}
            href={category.href}
          />
        </div>
      ))}
    </div>
  );
};

export default JewelryShowcase;