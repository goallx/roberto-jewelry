'use client';

import { IProduct } from '@/stores/ProductStore';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FiltersSidebar from './FiltersSidebar';

export default function CollectionsDisplay({ products }: { products: IProduct[] }) {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    const toggleWishlist = (index: number) => {
        setWishlist((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );

        const navbarWishlist = document.getElementById('navbar-wishlist');
        if (navbarWishlist) {
            navbarWishlist.scrollIntoView({ behavior: 'smooth' });
            navbarWishlist.classList.add('animate-pulse');
            setTimeout(() => navbarWishlist.classList.remove('animate-pulse'), 600);
        }
    };

    // Update query params helper
    const updateQuery = (key: string, value: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!value || value === 'all') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="bg-[#FAF8F6] min-h-screen">
            <div className="flex flex-col md:flex-row gap-10 px-4 md:px-10 pt-32 pb-20">
                <FiltersSidebar />
                {/* Product Grid */}
                <div className="md:w-4/5 w-full">
                    <div className="flex justify-between items-center mb-5">
                        <p className="text-sm text-gray-600">
                            Showing {products?.length} products
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white overflow-hidden border border-gray-200 shadow-sm"
                            >
                                <div className="relative w-full h-64">
                                    <Image
                                        src={product.images?.[0]?.imgUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Wishlist Icon */}
                                    <button
                                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-sm hover:text-red-500 transition"
                                        onClick={() => toggleWishlist(index)}
                                    >
                                        {wishlist.includes(index) ? (
                                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.5c0 4.75-9 10-9 10S3 13.25 3 8.5C3 6.014 5.014 4 7.5 4c1.54 0 2.94.785 3.8 2.003C12.56 4.785 13.96 4 15.5 4 17.986 4 20 6.014 20 8.5z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                    <p className="text-orange-600 font-semibold text-sm mt-1">
                                        ${product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
