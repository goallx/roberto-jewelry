
import { Loader } from "@/components/loader/Loader"
import { ProductCard } from "@/components/product-card/ProductCard"
import { useStores } from "@/context/StoreContext"
import { IProduct, ProductStore } from "@/stores/ProductStore"
import { useEffect, useState } from "react"

interface RelatedItemsProps {
    categoryId: string
}

const RelatedItems: React.FC<RelatedItemsProps> = ({ categoryId }) => {
    let { productStore } = useStores()
    const [relatedProducts, setRelatedProducts] = useState<Array<IProduct>>([])

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!productStore) productStore = new ProductStore()
            const products = await productStore.fetchProductsByCategory(categoryId)
            setRelatedProducts(products ?? [])
        }
        if (categoryId) fetchRelatedProducts()
    }, [categoryId])

    if (!productStore) return null

    if (!categoryId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-700 text-lg font-semibold">No related items</p>
            </div>
        )
    }


    return (
        <div className="flex overflow-x-auto gap-8 px-1 shadow-scroll-indicator">
            {productStore.isLoading ? (
                <Loader />
            ) : (
                relatedProducts.map((product: IProduct) => (
                    <div key={product._id} className="flex-shrink-0 py-4 px-2 md:py-6 md:w-1/4 flex justify-center">
                        <ProductCard product={product} />
                    </div>
                ))
            )}
        </div>
    )
}

export default RelatedItems