'use client'

import { IProduct, ProductStore } from "@/stores/ProductStore"
import React, { useEffect, useState } from "react"
import ProductDetails from "../../../collections/components/ProductDetails"

import { Breadcrumb } from "@/components/breadcrumbs/Breadcrumb"
import RelatedItems from "./RelatedItems"

interface ProductPageProps {
    product: IProduct | null
}

const ProductPage: React.FC<ProductPageProps> = ({ product }: ProductPageProps) => {
    console.log('@@prodict', product)

    if (!product) {
        return null
    }

    return (
        <div className="h-full">
            {/* <div className="mt-24 px-8">
                <Breadcrumb />
            </div> */}

            <ProductDetails product={product} />
            {/* <section className="py-16 md:px-8 px-2 text-center flex flex-col gap-8">
                <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">Related Items</h2>
                <RelatedItems categoryId={product.category} />
            </section> */}

            <section className="py-16 md:px-8 px-2 text-center flex flex-col gap-8">
                <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">Our Best Selling Items</h2>
                <div className="flex overflow-x-auto gap-8 shadow-scroll-indicator">
                    {/* {productStore.bestSellingProducts.map((product: IProduct) => (
                        <div key={product.id} className="flex-shrink-0 py-4 px-2 md:py-6 md:w-1/4 flex justify-center">
                            <ProductCard product={product} />
                        </div>
                    ))} */}
                </div>
            </section>
        </div>
    )
}

export default ProductPage