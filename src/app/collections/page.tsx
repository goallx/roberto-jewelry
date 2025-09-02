// app/collections/page.tsx
import { IProduct } from "@/stores/ProductStore";
import { getProducts } from "./action";
import CollectionsDisplay from "./components/CollectionsDisplay";

type CollectionsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const filters = {
    category_name:
      typeof searchParams.category === "string"
        ? searchParams.category
        : undefined,
    gender:
      typeof searchParams.gender === "string" ? searchParams.gender : undefined,
    minPrice: searchParams.minPrice
      ? Number(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? Number(searchParams.maxPrice)
      : undefined,
    search:
      typeof searchParams.search === "string" ? searchParams.search : undefined,
    material: searchParams.material
      ? Array.isArray(searchParams.material)
        ? searchParams.material
        : [searchParams.material]
      : undefined,
  };

  let products: IProduct[] = [];

  try {
    products = await getProducts(filters);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  console.log('@@prodicts', products)
  return (
    <div className="bg-[#FAF8F6] min-h-screen">
      <div className="px-4 md:px-10 pt-40 pb-0">
        <h1 className="text-3xl md:text-4xl font-amandine font-semibold text-center mb-3">
          {typeof searchParams.category === "string"
            ? searchParams.category
            : "Collection Name"}
        </h1>
        <p className="text-center text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          A curated selection of jewelry for every style and occasion.
        </p>
      </div>
      <CollectionsDisplay products={products} />
    </div>
  );
}
