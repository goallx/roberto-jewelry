import { getProducts } from "./action";
import CollectionsDisplay from "./components/CollectionsDisplay";


type CollectionsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const params = await searchParams
  const filters = {
    category_name: typeof params.category === "string" ? params.category : undefined,
    gender: typeof params.gender === "string" ? params.gender : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    material: typeof params.material === "string" ? params.material : undefined,
  };

  const products = await getProducts(filters);

  return (
    <div className="bg-[#FAF8F6] min-h-screen">
      <div className="px-4 md:px-10 pt-32 pb-20">
        <h1 className="text-3xl md:text-4xl font-amandine font-semibold text-center mb-3">
          {filters.category_name ? filters.category_name : "Collection Name"}
        </h1>
        <p className="text-center text-sm text-gray-600 mb-10 max-w-xl mx-auto">
          {/* {t('collection.description', 'Discover our curated selection of handcrafted jewelry, each piece designed to celebrate life\'s precious moments.')} */}
        </p>
      </div>
      <CollectionsDisplay products={products} />
    </div>
  );
};
