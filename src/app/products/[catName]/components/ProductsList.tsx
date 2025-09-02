'use client'

import { Breadcrumb } from "@/components/breadcrumbs/Breadcrumb";
import { PageLoader } from "@/components/loader/PageLoader";
// Remove the problematic import and use a placeholder or fix the path
// import { ProductCard } from "@/components/product-card/ProductCard";
import { useStores } from "@/context/StoreContext";
import { ICategory } from "@/stores/CategoryStore";
import { IProduct, ProductStore } from "@/stores/ProductStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Select } from "antd"
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton";
import { genderOptions, materialOptions, sortBy } from "@/stores/consts";
import { EmptyStateSVG } from "./emptySvg";
import Head from "next/head";

// Create a simple ProductCard component as a placeholder
// Replace this with your actual ProductCard component
const ProductCard = ({ product }: { product: IProduct }) => (
  <div className="product-card">
    <h3>{product.name}</h3>
    <p>Price: ${product.price}</p>
    {/* Add more product details as needed */}
  </div>
);

interface ProductsPageProps {
    category: ICategory
}

// Update the interfaces to include _id property
interface ICategoryWithId extends ICategory {
    _id: string;
}

interface IProductWithId extends IProduct {
    _id: string;
}

const ProductsList: React.FC<ProductsPageProps> = observer(({ category }) => {

    let { productStore } = useStores();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<IProductWithId[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async (catId: string) => {
            if (!productStore) productStore = new ProductStore()
            await productStore.fetchProductsByCategory(catId);
        };
        if (category && (category as ICategoryWithId)._id) {
            fetchProducts((category as ICategoryWithId)._id);
        } else {
            setErrorMessage("Something went wrong!");
        }

    }, [category, productStore]);

    if (!productStore) return null

    const filterAccordingToMaterial = (products: IProductWithId[]): IProductWithId[] => {
        if (!selectedMaterial) return products;
        return [...products].filter(product => product.material.includes(selectedMaterial));
    };

    const filterAccordingToGender = (products: IProductWithId[]): IProductWithId[] => {
        if (!selectedGender) return products;
        const filtered = [...products].filter(product =>
            product.gender.toLowerCase() === selectedGender.toLowerCase()
        );
        if (selectedGender.toLowerCase() !== 'unisex') {
            return [...filtered, ...products.filter(product => product.gender.toLowerCase() === 'unisex')];
        }
        return filtered;
    };

    const sortProducts = (products: IProductWithId[]): IProductWithId[] => {
        if (!selectedSort) return products;
        if (selectedSort === "highest-to-lowest") {
            return [...products].sort((a, b) => b.price - a.price);
        }
        else {
            return [...products].sort((a, b) => a.price - b.price);
        }
    };

    useEffect(() => {
        if (!productStore?.products) return;
        let processedProducts = sortProducts(productStore.products as IProductWithId[]);
        processedProducts = filterAccordingToMaterial(processedProducts);
        processedProducts = filterAccordingToGender(processedProducts);
        if (selectedSort) processedProducts = sortProducts(processedProducts)
        setFilteredProducts(() => {
            return processedProducts
        });
    }, [productStore.products, selectedMaterial, selectedSort, selectedGender]);

    // Get the first image URL safely
    const categoryImage = category?.images?.[0]?.imgUrl || '';

    return (
        <>
            <Head>
                {categoryImage && (
                    <link
                        rel="preload"
                        href={categoryImage}
                        as="image"
                    />
                )}
            </Head>
            <header
                className="h-[520px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
                style={{ backgroundImage: categoryImage ? `url("${categoryImage}")` : 'none' }}
            >
                <h1 className="font-amandine tracking-extra-wide capitalize text-black px-4 py-2 rounded-lg transform scale-100 sm:scale-125 md:scale-150 text-2xl sm:text-3xl md:text-4xl lg:text-5xl truncate">
                    {category?.name || 'Category'}
                </h1>
            </header>
            <div className="px-8 mt-6">
                <Breadcrumb />
                <div className="mt-8 mb-8 flex items-center flex-wrap gap-4">

                    <Select
                        allowClear
                        style={{ minWidth: '140px' }}
                        placeholder="Material"
                        onChange={setSelectedMaterial}
                        defaultValue={selectedMaterial}
                        options={materialOptions}
                    />

                    <Select
                        allowClear
                        style={{ minWidth: '140px' }}
                        placeholder="Sort By"
                        onChange={setSelectedSort}
                        defaultValue={selectedSort}
                        options={sortBy}
                    />

                    <Select
                        allowClear
                        style={{ minWidth: '140px' }}
                        placeholder="Gender"
                        onChange={setSelectedGender}
                        defaultValue={selectedGender}
                        options={genderOptions}
                    />

                    <CustomizedButton
                        title="Reset"
                        width="100px"
                        height="30px"
                        onClick={() => {
                            setSelectedMaterial(null);
                            setSelectedSort(null);
                            setSelectedGender(null)
                        }}
                    />
                </div>
            </div >
            {errorMessage && <p className="text-red-500 font-bold text-center mt-10">{errorMessage}</p>
            }
            {
                productStore.isLoading ? (
                    <div className="mt-11">
                        <PageLoader />
                    </div>
                ) : (
                    filteredProducts.length ?
                        <div className="px-2 pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12 justify-items-center">
                            {filteredProducts.map((product: IProductWithId) => {
                                if (!product.stock) return null;
                                return <ProductCard key={product._id} product={product} />;
                            })}
                        </div>
                        :
                        <div className="text-center text-xl min-h-[20vh] flex flex-col items-center justify-center mb-10">
                            <EmptyStateSVG />
                            <p className="font-light text-gray-600">No products found. Try adjusting your filters.</p>
                        </div>
                )
            }
        </>
    );
});

export default ProductsList;