import ProductPage from "@/app/products/[catName]/components/ProductPage"
import { getProductById } from "@/app/products/action"

export default async function ItemPage({ params }: { params: Promise<{ collectionId: string }> }) {
    const { collectionId } = await params
    const product = await getProductById(collectionId)

    return (
        <ProductPage product={product} />
    )

}