'use server'

import { ProductCard } from "@/app/collections/components/ProductCard";
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
        {rings.map((ring) => (
          <ProductCard key={ring.id} product={ring} />
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

