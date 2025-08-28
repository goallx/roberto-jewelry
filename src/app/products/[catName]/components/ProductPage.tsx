'use client'

import { PageLoader } from "@/components/loader/PageLoader"
import { useStores } from "@/context/StoreContext"
import { IProduct, ProductStore } from "@/stores/ProductStore"
import React, { useEffect, useState } from "react"
import ProductDetails from "./ProductDetails"
import { observer } from "mobx-react-lite"
import { Breadcrumb } from "@/components/breadcrumbs/Breadcrumb"
import RelatedItems from "./RelatedItems"
import { ProductCard } from "@/components/product-card/ProductCard"

interface ProductPageProps {
    productId: string
}

const ProductPage: React.FC<ProductPageProps> = observer(({ productId }) => {

    let { productStore } = useStores()
    const [product, setProduct] = useState<IProduct | null>(null)
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        return () => {
            setProduct(null)
        }
    }, [])

    useEffect(() => {
        if (!productStore) productStore = new ProductStore()
        const fetchBestSellingProducts = async () => {
            await productStore?.fetchBestSellingProducts()
        }
        const getProductById = async () => {
            try {
                const fetchedProduct = await productStore?.getProductById(productId)
                if (fetchedProduct) {
                    setProduct(fetchedProduct)
                    setError("")
                } else {
                    setError("Product not found! Please try again later.")
                }
            } catch (err) {
                setError("An error occurred while fetching the product.")
            } finally {
                setIsLoading(false)
            }
        }
        if (productId) getProductById()
        fetchBestSellingProducts()
    }, [productId, productStore])

    if (!productStore) return null

    if (isLoading) {
        return (
            <div className="flex flex-col justify-evenly items-center min-h-screen">
                <PageLoader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-700 text-lg font-semibold">{error}</p>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="mt-24 px-8">
                <Breadcrumb />
            </div>
            {
                product && <ProductDetails product={product} />
            }
            <section className="py-16 md:px-8 px-2 text-center flex flex-col gap-8">
                <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">Related Items</h2>
                <RelatedItems categoryId={product?.category ?? ""} />
            </section>

            <section className="py-16 md:px-8 px-2 text-center flex flex-col gap-8">
                <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">Our Best Selling Items</h2>
                <div className="flex overflow-x-auto gap-8 shadow-scroll-indicator">
                    {productStore.bestSellingProducts.map((product: IProduct) => (
                        <div key={product._id} className="flex-shrink-0 py-4 px-2 md:py-6 md:w-1/4 flex justify-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
})

export default ProductPage