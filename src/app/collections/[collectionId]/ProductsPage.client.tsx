'use client';

import React from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import ProductPage from '@/app/products/[catName]/components/ProductPage';
import ProductsList from '@/app/products/[catName]/components/ProductsList';


interface ProductsPageClientProps {
    name: string;
    date?: string;
    numOfProducts?: number;
    description?: string;
    images: string;
    _id: string;
}

const ProductsPageClient: React.FC<ProductsPageClientProps> = ({ name, date, numOfProducts, description, images, _id }) => {
    const productId = useSearchParams().get('id');

    return (
        <>
            <Head>
                <title>{name || "Products"} - Products</title>
                <meta name="description" content={`Browse products for the ${name} category.`} />
            </Head>
            <div className="min-h-screen bg-gray-100">
                {productId ? (
                    <ProductPage productId={productId} />
                ) : name ? (
                    <ProductsList category={{ name, date, numOfProducts, description, images: JSON.parse(images), _id }} />
                ) : (
                    <p>Category not found</p>
                )}
            </div>
        </>
    );
};

export default ProductsPageClient;
