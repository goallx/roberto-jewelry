'use server'

import { getProducts } from "@/app/products/action";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_IMAGE = "/products/rings/ring1"

export default async function RingsCollection() {
  const rings = await getProducts({ category_name: 'rings' })

  if (!rings) {
    return null
  }

  return (

    <section
      className="pt-16 pb-6 px-6 lg:px-20 text-center flex flex-col gap-8"
      style={{ backgroundColor: "#F5F3EFCC" }}
    >
      <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">
        Our Rings Collection
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-8 text-base leading-relaxed">
        Discover our most beloved pieces, each crafted with exceptional attention to detail and timeless design.
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 px-4 sm:px-0">
        {rings.map((ring, index) => (
          <Link
            key={index}
            href={'/products'}
            className="relative block aspect-square shadow-lg group"
          >
            {/* Wishlist Heart Icon */}
            <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-white border border-gray-300 flex items-center justify-center cursor-pointer group-hover:bg-gray-100 transition-colors">
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
                src={ring.images?.[0].imgUrl || DEFAULT_IMAGE}
                alt={DEFAULT_IMAGE}
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>

            {/* Text info container */}
            <div className="h-[88px] mt-3 px-1 text-left">
              <p className="text-base font-medium text-gray-900">{ring.description}</p>
              <p className="text-orange-600 text-xl font-semibold mt-0.5">{ring.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link href={'/collections'}>
        <button className="mt-10 mx-auto px-8 py-3 bg-black text-white font-semibold max-w-xs hover:bg-gray-900 transition-colors">
          View All Collections &rarr;
        </button>
      </Link>
    </section>
  )
}

