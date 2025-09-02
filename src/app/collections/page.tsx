'use client';

import { getProducts } from "./action";
import CollectionsDisplay from "./components/CollectionsDisplay";
import { useState, useEffect } from "react";

type CollectionsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Simple translation function - replace with your actual i18n implementation
const t = (key: string, defaultValue: string): string => {
  // This is a placeholder - you would replace this with your actual i18n logic
  const translations: Record<string, string> = {
    'collection.title': 'Collection Name',
    'collection.description': 'Discover our curated selection of handcrafted jewelry, each piece designed to celebrate life\'s precious moments.'
  };
  
  return translations[key] || defaultValue;
};

export default function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const filters = {
        category_name: typeof searchParams.category === "string" ? searchParams.category : undefined,
        gender: typeof searchParams.gender === "string" ? searchParams.gender : undefined,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        search: typeof searchParams.search === "string" ? searchParams.search : undefined,
        material: typeof searchParams.material === "string" ? searchParams.material : undefined,
      };

      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="bg-[#FAF8F6] min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F6] min-h-screen">
      <div className="px-4 md:px-10 pt-40 pb-0">
        <h1 className="text-3xl md:text-4xl font-amandine font-semibold text-center mb-3">
          {typeof searchParams.category === "string" ? searchParams.category : t('collection.title', 'Collection Name')}
        </h1>
        <p className="text-center text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          {t('collection.description', 'Discover our curated selection of handcrafted jewelry, each piece designed to celebrate life\'s precious moments.')}
        </p>
      </div>
      <CollectionsDisplay products={products} />
    </div>
  );
}