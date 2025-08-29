import { IProduct } from "@/stores/ProductStore"
import React from "react"
import ProductDetails from "./ProductDetails"
import RelatedItems from "./RelatedItems"
import BestSelling from "./BestSelling"
import { Breadcrumb } from "@/components/breadcrumbs/Breadcrumb"

interface ProductPageProps {
    product: IProduct
}

const ProductPage: React.FC<ProductPageProps> = ({ product }: ProductPageProps) => {

    return (
        <div className="h-full">
            <div className="mt-24 px-8">
                {/* <Breadcrumb /> */}
            </div>
            <ProductDetails product={product} />
            <section className="py-16 md:px-8 px-2 text-center flex flex-col gap-8">
                <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">Related Items</h2>
                <RelatedItems categoryId={product.category} />
            </section>
            <BestSelling />
        </div>
    )
}

export default ProductPage