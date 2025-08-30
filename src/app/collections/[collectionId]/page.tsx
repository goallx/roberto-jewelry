import { getProductById } from "@/app/collections/action"
import ProductPage from "../components/ProductPage"
import NotFound from "./not-found"

export default async function ItemPage({ params }: { params: Promise<{ collectionId: string }> }) {
    const { collectionId } = await params
    const product = await getProductById(collectionId)

    if (!product) {
        return NotFound()
    }

    return (
        <ProductPage product={product} />
    )

}