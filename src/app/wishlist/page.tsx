'use client'

import { Loader } from '@/components/loader/Loader';
import { useStores } from '@/context/StoreContext';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { WishlistStore } from '@/stores/WishlistStore';
import Image from 'next/image';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { CartStore } from '@/stores/CartStore';

const DEFAULT_IMAGE = "/products/rings/ring1";

const Wishlist: React.FC = observer(() => {
    let { wishlistStore, cartStore } = useStores();
    const router = useRouter();

    useEffect(() => {
        if (!wishlistStore) wishlistStore = new WishlistStore();
        if (!cartStore) cartStore = new CartStore()
        wishlistStore.fetchWishlist();
    }, [wishlistStore]);

    // if (wishlistStore?.isLoading) {
    //     return (
    //         <div className="flex-1 flex justify-center items-center min-h-screen">
    //             <Loader />
    //         </div>
    //     );
    // }

    const addToCart = async (productId: string) => {
        await cartStore?.addToCart(productId)
    }

    const handleRemove = async (productId: string) => {
        if (!wishlistStore) return;
        await wishlistStore.removeFromWishlist(productId);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 mt-20">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">My Wishlist</h1>

            {(!wishlistStore?.items?.length) ? (
                <p className="text-center text-gray-500 text-lg mt-12">
                    Your wishlist is empty.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistStore.items.map(item => (
                        <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow">

                            {/* Remove button */}
                            <Button
                                onClick={(e) => { e.stopPropagation(); handleRemove(item.product_id); }}
                                shape="circle"
                                icon={<CloseCircleOutlined />}
                                className="absolute top-2 right-2 z-10 bg-white border border-gray-300 hover:bg-red-50 transition-colors"
                            />

                            {/* Product image */}
                            <div className="relative w-full h-64">
                                <Image
                                    src={item.product.images?.[0].imgUrl || DEFAULT_IMAGE}
                                    alt={item.product.description || "Product"}
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Product info */}
                            <div className="p-4">
                                <p className="text-gray-900 font-medium text-base">{item.product.description}</p>
                                <p className="text-orange-600 font-bold text-lg mt-1">{item.product.price}$</p>
                            </div>

                            <Button onClick={() => addToCart(item.product_id)} className='w-full border-none my-3 shadow-sm' variant="solid" >Add to cart</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default Wishlist;
