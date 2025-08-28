"use client";

import { useEffect, useState } from "react";
import { useStores } from "@/context/StoreContext";
import { CategoryStore } from "@/stores/CategoryStore";
import HomePageServer from "./HomePageServer";
import { IProduct } from "@/stores/ProductStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const HomePageClient = () => {
    let { categoryStore } = useStores();
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
    const [bestSelling, setBestSelling] = useState<IProduct[] | null>(null);

    useEffect(() => {
        const fetchBestSelling = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/product/best-selling`, { next: { revalidate: 3600 } });
                if (!res.ok) throw new Error("Failed to fetch products");
                const { data } = await res.json();
                setBestSelling(data);
            } catch (error) {
                console.error("Error fetching best-selling products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                if (!categoryStore) categoryStore = new CategoryStore();
                await categoryStore.fetchCategories();
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };

        if (!bestSelling) fetchBestSelling();

        if (categoryStore && !categoryStore?.categories?.length) fetchCategories();
    }, [categoryStore?.categories, bestSelling]);

    return (
        <HomePageServer
            categories={categoryStore?.categories ?? []}
            loadingCategories={loadingCategories}
            bestSellingProducts={bestSelling ?? []}
        />
    );
};

export default HomePageClient;
