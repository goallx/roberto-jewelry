'use client';

import Image from 'next/image';
import { useState } from 'react';

const products = [
  {
    title: 'Classic Diamond Ring',
    price: '$2,500',
    img: '/image/classic-diamond-ring.jpg',
  },
  {
    title: 'Elegant Gold Necklace',
    price: '$1,800',
    img: '/image/classic-gold-necklace.jpg',
  },
  {
    title: 'Tennis Bracelet',
    price: '$3,200',
    img: '/image/elegant-tennis-bracelet.jpg',
  },
  {
    title: 'Diamond Stud Earrings',
    price: '$1,500',
    img: '/image/diamond-stud-earring.jpg',
  },
  {
    title: 'Vintage Ring Collection',
    price: '$4,500',
    oldPrice: '$6,000',
    img: '/image/classic-diamond-ring.jpg',
  },
  {
    title: 'Pearl Drop Necklace',
    price: '$2,200',
    img: '/image/classic-gold-necklace.jpg',
  },
];

export default function CollectionPage() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (index: number) => {
    setWishlist((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );

    // Scroll to navbar wishlist and highlight it
    const navbarWishlist = document.getElementById('navbar-wishlist');
    if (navbarWishlist) {
      navbarWishlist.scrollIntoView({ behavior: 'smooth' });
      navbarWishlist.classList.add('animate-pulse');
      setTimeout(() => navbarWishlist.classList.remove('animate-pulse'), 600);
    }
  };

  return (
    <div className="bg-[#FAF8F6] min-h-screen">
      {/* Page content starts lower to avoid navbar overlap */}
      <div className="px-4 md:px-10 pt-32 pb-20">
        <h1 className="text-3xl md:text-4xl font-amandine font-semibold text-center mb-3">
          Collection Name
        </h1>
        <p className="text-center text-sm text-gray-600 mb-10 max-w-xl mx-auto">
          Discover our curated selection of handcrafted jewelry, each piece
          designed to celebrate life's precious moments.
        </p>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Filter Sidebar */}
          <div className="md:w-1/5 w-full space-y-6">
            <div className="border p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-gray-700">Filters</h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <select className="w-full border px-2 py-1 mt-1 text-sm">
                  <option>All Jewelry</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Price Range</label>
                <select className="w-full border px-2 py-1 mt-1 text-sm">
                  <option>All Prices</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Material</label>
                <div className="flex flex-col gap-1 mt-1 text-sm">
                  <label>
                    <input type="checkbox" className="mr-2" /> Gold
                  </label>
                  <label>
                    <input type="checkbox" className="mr-2" /> Silver
                  </label>
                  <label>
                    <input type="checkbox" className="mr-2" /> Platinum
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-4/5 w-full">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-gray-600">
                Showing {products.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden border border-gray-200 shadow-sm"
                  style={{ borderRadius: '0px' }}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    {/* Wishlist Icon */}
                    <button
                      className="absolute top-2 right-2 p-1 bg-white/90 rounded-sm hover:text-red-500 transition"
                      onClick={() => toggleWishlist(index)}
                    >
                      {wishlist.includes(index) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.5c0 4.75-9 10-9 10S3 13.25 3 8.5C3 6.014 5.014 4 7.5 4c1.54 0 2.94.785 3.8 2.003C12.56 4.785 13.96 4 15.5 4 17.986 4 20 6.014 20 8.5z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.title}
                    </h3>
                    <p className="text-orange-600 font-semibold text-sm mt-1">
                      {product.price}{' '}
                      {product.oldPrice && (
                        <span className="line-through text-gray-400 text-xs ml-2">
                          {product.oldPrice}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
