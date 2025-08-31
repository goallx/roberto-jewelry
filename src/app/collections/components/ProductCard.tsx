'use client'

import { IProduct } from "@/stores/ProductStore";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useStores } from "@/context/StoreContext";
import { useState } from "react";
import { observer } from "mobx-react-lite";

interface ProductCardProps {
    product?: IProduct;
}
const DEFAULT_IMAGE = "/products/rings/ring1";

// Skeleton Component
const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="h-[330px] flex flex-col cursor-pointer shadow-md relative animate-pulse">
            {/* Wishlist Skeleton */}
            <div className="absolute top-3 right-3 z-50 w-8 h-8 bg-gray-200 rounded-full"></div>

            {/* Image Skeleton */}
            <div className="relative w-full h-full bg-gray-200"></div>

            {/* Text Skeleton */}
            <div className="h-[88px] mt-3 px-1 text-left">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );
};

export const ProductCard: React.FC<ProductCardProps> = observer(({ product }) => {
    const router = useRouter();
    const { wishlistStore } = useStores();
    const [loading, setLoading] = useState(false);

    if (loading || !product) {
        return <ProductCardSkeleton />;
    }

    const isInWishlist = wishlistStore?.isInWishlist(product.id);

    const handleWishlistClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!wishlistStore) return;
        setLoading(true);
        try {
            if (!isInWishlist)
                await wishlistStore.addToWishlist(product.id);
            else
                await wishlistStore.removeFromWishlist(product.id)
        } catch (err: any) {
            if (err.message === "not authenticated") {
                router.push('/login')
                return
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={() => router.push(`/collections/${product.id}`)}
            className="h-[330px] flex flex-col cursor-pointer shadow-md relative"
        >
            <div
                onClick={handleWishlistClick}
                className="absolute top-3 right-3 z-50 w-8 h-8 bg-white border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isInWishlist ? "red" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.613 0-2.927 1.004-3.312 2.36a3.616 3.616 0 00-3.312-2.36C5.1 3.75 3 5.765 3 8.25c0 4.082 7.5 10.5 9 10.5s9-6.418 9-10.5z"
                    />
                </svg>
            </div>

            <div className="relative w-full h-full">
                <Image
                    src={product.images?.[0]?.imgUrl || DEFAULT_IMAGE}
                    alt={DEFAULT_IMAGE}
                    fill
                    loading="lazy"
                    className="object-cover"
                />
            </div>

            <div className="h-[88px] mt-3 px-1 text-left">
                <p className="text-base font-medium text-gray-900">{product.description}</p>
                <p className="text-orange-600 text-xl font-semibold mt-0.5">{product.price}</p>
            </div>
        </div>
    );
});
