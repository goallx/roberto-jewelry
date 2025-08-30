import { IProduct } from "@/stores/ProductStore"
import { Loader } from "@/components/loader/Loader"
import { getProductsByCategory } from "@/app/collections/action"
import { ProductCard } from "./ProductCard"

interface RelatedItemsProps {
    categoryId: string
}

export default async function RelatedItems({ categoryId }: RelatedItemsProps) {

    if (!categoryId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-700 text-lg font-semibold">No related items</p>
            </div>
        )
    }

    const products = await getProductsByCategory(categoryId)

    if (!products) {
        return (
            <div>
                <Loader />
            </div>
        )
    }
    return (
        <div className="flex overflow-x-auto gap-8 px-1 shadow-scroll-indicator">
            {
                products.map((product: IProduct) => (
                    <div key={product.id} className="flex-shrink-0 py-4 px-2 md:py-6 md:w-1/4 flex justify-center">
                        <ProductCard product={product} />
                    </div>
                ))
            }
        </div>
    )
}
