'use client'

import { PageLoader } from '@/components/loader/PageLoader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { ProductsDisplay } from './components/productsDisplay.component';
import { materialsImages } from './components/consts';

const Products = () => {
    const [material, setMaterial] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            const material = searchParams.get('material')
            setMaterial(material ?? "all")
            setLoading(false)
        }
    }, [searchParams])

    if (loading) {
        return (
            <div className='h-screen flex flex-col justify-center'>
                <PageLoader />
            </div>
        )
    }

    return (
        <>
            <header className="h-[550px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center" style={{ backgroundImage: `url("${materialsImages[material] || ''}")` }}>
                <h1 className="font-amandine tracking-extra-wide capitalize text-black text-4xl px-4 py-2 rounded-lg transform scale-150 bg-white bg-opacity-75">
                    {material?.toUpperCase()}
                </h1>
            </header>
            {
                material &&
                <ProductsDisplay material={material} />
            }
        </>
    );
};

export default Products;