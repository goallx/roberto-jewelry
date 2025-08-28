"use client";

import { IProduct } from "@/stores/ProductStore";
import { useRouter } from "next/navigation";
import { BlurImage } from "../blur-image/BlurImage.component";

interface ProductCardProps {
    product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${product.categoryName.toLowerCase()}?id=${product._id}`);
    };

    if (!product) {
        return <div>SOMETHING WENT WRONG!</div>;
    }

    return (
        <div
            onClick={handleClick}
            className="
        group
        relative
        cursor-pointer
        shadow-lg
        rounded-lg
        overflow-hidden
        transition-transform
        duration-300
        ease-in-out
        hover:shadow-xl
        hover:scale-105

        /* 
          1) Fix a 2:3 aspect ratio so width and height
             remain consistent at each breakpoint.
        */
        aspect-[2/3]

        /*
          2) Adjust the width for different screen sizes,
             so it stays 'fully responsive' but each card
             has the same dimension at each breakpoint.
        */
        w-[200px]    /* default for very small screens */
        sm:w-[240px] /* small breakpoint */
        md:w-[280px] /* medium breakpoint */
        lg:w-[320px] /* large breakpoint */

        bg-white
      "
        >
            {/* 
        3) Top 2/3 for the image, 
           using absolute positioning within the aspect-ratio container.
      */}
            <div className="absolute top-0 left-0 w-full h-2/3">
                <BlurImage
                    className="absolute inset-0 object-cover"
                    src={product.images[0].imgUrl}
                    alt="product image"
                    priority
                    quality={75}
                />
            </div>

            {/* Bottom 1/3 for text/details */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 px-4 py-2 flex flex-col justify-center items-center">
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-center mb-1 line-clamp-1">
                    {product.name}
                </p>
                <div className="w-4/5 h-px bg-gray-200 my-1" />
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 line-clamp-1">
                    ${product.price.toLocaleString("en-US")}
                </p>
            </div>
        </div>
    );
};
