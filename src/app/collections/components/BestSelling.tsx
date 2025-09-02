import { IProduct } from "@/stores/ProductStore";
import { ProductCard } from "./ProductCard";
import { getMostSellingProducts } from "@/app/collections/action";
import { Loader } from "@/components/loader/Loader";

export default async function BestSelling() {
    const bestSelling = await getMostSellingProducts()

    if (!bestSelling) {
        return (
            <div>
                <Loader />
            </div>
        )
    }

    return (
        <section className="py-16 md:px-8 px-2 text-center flex flex-col gap-8">
            <h2 className="font-amandine text-3xl font-bold text-gray-800 mb-4">Our Best Selling Items</h2>
            <div className="flex overflow-x-auto gap-1 shadow-scroll-indicator">
                {bestSelling.map((product: IProduct) => (
                    <div key={product.id} className="flex-shrink-0 py-4 px-2 md:py-6 md:w-1/4 flex justify-center">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    )
}