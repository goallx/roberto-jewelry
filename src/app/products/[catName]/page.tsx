import { CategoryStore } from '@/stores/CategoryStore';
import ProductsPageClient from './ProductsPage.client';

export default async function Page({ params }: { params: Promise<{ catName: string }> }) {
    const { catName } = await params
    const categoryStore = new CategoryStore();
    const decodedCatName = decodeURIComponent(catName);

    const category = await categoryStore.getCategoryByName(decodedCatName);
    if (!category) return <p>Category not found</p>;

    return <ProductsPageClient
        name={category.name}
        date={category.date}
        numOfProducts={category.numOfProducts}
        description={category.description}
        images={JSON.stringify(category.images)}
        _id={category._id}
    />;
}

