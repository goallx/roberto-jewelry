'use client';

import React from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import ProductsList from './components/ProductsList';
// Remove the missing import - we'll handle it differently

interface ProductsPageClientProps {
    name: string;
    date?: string;
    numOfProducts?: number;
    description?: string;
    images: string;
    _id: string;
}

// Create a simple ProductPage component since the import is missing
const ProductPage: React.FC<{ productId: string }> = ({ productId }) => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p>Product ID: {productId}</p>
            <p className="text-gray-600">Product page component would go here.</p>
        </div>
    );
};

const ProductsPageClient: React.FC<ProductsPageClientProps> = ({ name, date, numOfProducts, description, images, _id }) => {
    const searchParams = useSearchParams();
    const productId = searchParams?.get('id');

    // Create category object with the properties that ProductsList expects
    // Use _id as id since ICategory expects id but we have _id
    const category = {
        id: _id, // Map _id to id
        name,
        description: description || '',
        images: images ? JSON.parse(images) : [],
    };

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
                    <ProductsList category={category} />
                ) : (
                    <p>Category not found</p>
                )}
            </div>
        </>
    );
};

export default ProductsPageClient;