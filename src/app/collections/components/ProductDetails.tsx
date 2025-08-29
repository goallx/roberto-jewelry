'use client';

import { IProduct } from "@/stores/ProductStore";
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton";
import { useState, useCallback } from "react";
import { useStores } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertsContext";
import { Badge } from "antd";
import { Loader } from "@/components/loader/Loader";
import { BlurImage } from "@/components/blur-image/BlurImage.component";
import dynamic from "next/dynamic";


const SizeChart = dynamic(() => import("@/components/size-chart/sizeChart.component"), {
    loading: () => <Loader />,
    ssr: false,
});

const ProductDetails: React.FC<{ product: IProduct }> = ({ product }) => {
    const { cartStore } = useStores();
    const router = useRouter();
    const { showAlert } = useAlert();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    const handleAddToCart = useCallback(async () => {
        // if (!isAuthenticated) {
        //     return setShowModal(true);
        // }

        // setLoading(true);
        // try {
        //     await cartStore?.addToCart(productData._id);
        //     showAlert(`'${productData.name}' has been added to cart`, 'success');
        // } catch (error) {
        //     showAlert('Failed to add product to cart', 'error');
        // } finally {
        //     setLoading(false);
        // }
    }, [cartStore, showAlert]);

    const handleBuyProduct = useCallback(async () => {
        try {
            await handleAddToCart();
            router.push('/payment');
        } catch (error) {
            showAlert('Failed to proceed to payment', 'error');
        }
    }, [handleAddToCart, router, showAlert]);

    const handleImageClick = useCallback((img: string) => {
        if (mainImage !== img) {
            setMainImage(img);
        }
    }, [mainImage]);

    return (
        <>
            <div className="max-w-7xl h-full mt-10 md:mt-20 mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-[63vh] md:col-span-2 flex flex-col gap-4 md:flex-row justify-start">
                    <div
                        className="w-full flex flex-row gap-3 items-center justify-start overflow-x-auto md:w-1/4 md:flex-col md:overflow-y-auto md:h-full order-2 md:order-1 z-20 scroll-smooth overflow-y-hidden">
                        {product.images?.map((img, index) => (
                            <BlurImage
                                key={index}
                                src={img.imgUrl}
                                alt={`Product Image ${index + 1}`}
                                className="object-cover cursor-pointer m-auto"
                                onClick={() => handleImageClick(img.imgUrl)}
                                quality={30}
                                loading="lazy"
                                isSelected={img.imgUrl === mainImage}
                            />
                        ))}
                    </div>

                    {mainImage ? (
                        <BlurImage
                            src={mainImage ?? ""}
                            alt="Main Product"
                            priority
                            loading="eager"
                            quality={100}
                            objectFit="cover"
                            className="md:order-2"
                            showZoomBtn
                        />
                    ) : (
                        <Loader />
                    )}
                </div >

                <Badge.Ribbon color={"gray"} text={"Lifetime Warranty"}>
                    <div className="md:col-span-1 flex flex-col shadow-sm p-4">

                        <div className={`${product.stock <= 5 ? "text-red-500" : ""} text-sm font-bold`}>
                            {product.stock === 0
                                ? `Out of stock`
                                : product.stock <= 5
                                    ? `Only ${product.stock} left!`
                                    : `${product.stock} in stock`}
                        </div>

                        <h1 className="text-3xl font-semibold mt-2">{product.name || "Product Name"}</h1>
                        <div className="text-2xl font-bold mt-4">${product.price?.toLocaleString('en-US') || "1,000"}</div>

                        <div className="mt-4 flex items-center gap-2">
                            <label className="text-base font-light">Gender:</label>
                            <p className="text-lg font-medium capitalize">{product.gender}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <label className="text-base font-light">Material:</label>
                            <p className="text-lg font-medium capitalize">{product.material}</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-4 mt-6">
                            <CustomizedButton
                                onClick={handleAddToCart}
                                backgroundColor={`${product.stock <= 0 ? '#EBEBE4' : 'white'}`}
                                color={`${product.stock <= 0 ? 'grey' : ""}`}
                                title="Add To Cart"
                                disabled={!product.stock || loading}
                                aria-label="Add to Cart"
                            />
                            <CustomizedButton
                                onClick={handleBuyProduct}
                                title="Buy Now"
                                disabled={!product.stock || loading}
                                backgroundColor={`${product.stock <= 0 ? '#EBEBE4' : 'black'}`}
                                color={`${product.stock <= 0 ? 'grey' : "white"}`}
                                aria-label="Buy Now"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="text-base font-medium">About the product:</label>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.description || "No description available."}
                            </p>
                        </div>

                        <div className="h-[1px] mt-2 w-full bg-gray-300" />
                        <SizeChart />
                    </div>
                </Badge.Ribbon>
            </div >
        </>
    );
};

export default ProductDetails;


