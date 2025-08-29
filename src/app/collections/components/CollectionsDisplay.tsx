
import { IProduct } from '@/stores/ProductStore';
import FiltersSidebar from './FiltersSidebar';
import { ProductCard } from './ProductCard';

export default function CollectionsDisplay({ products }: { products: IProduct[] }) {
    return (
        <div className="bg-[#FAF8F6] min-h-screen">
            <div className="flex flex-col md:flex-row gap-10 px-4 md:px-10 pt-32 pb-20">
                <FiltersSidebar />
                <div className="md:w-4/5 w-full">
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-sm text-gray-600">
                            Showing {products?.length} products
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard product={product} key={product.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
