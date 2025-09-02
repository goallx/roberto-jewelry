import { IProduct } from "@/stores/ProductStore";
import { getProducts } from "./action";
import CollectionsDisplay from "./components/CollectionsDisplay";

type CollectionsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const params = await searchParams
  const filters = {
    category_name:
      typeof params.category === "string"
        ? params.category
        : undefined,
    gender:
      typeof params.gender === "string" ? params.gender : undefined,
    minPrice: params.minPrice
      ? Number(params.minPrice)
      : undefined,
    maxPrice: params.maxPrice
      ? Number(params.maxPrice)
      : undefined,
    search:
      typeof params.search === "string" ? params.search : undefined,
    material: params.material
      ? Array.isArray(params.material)
        ? params.material
        : [params.material]
      : undefined,
  };

  let products: IProduct[] = [];

  try {
    products = await getProducts(filters);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="bg-[#FAF8F6] min-h-screen">
      <div className="px-4 md:px-10 pt-40 pb-0">
        <h1 className="text-3xl md:text-4xl font-amandine font-semibold text-center mb-3">
          {typeof params.category === "string"
            ? params.category
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
