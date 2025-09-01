// Cart.tsx
'use client';

import { useStores } from '@/context/StoreContext';
import { IProduct } from '@/stores/ProductStore';
import React, { useEffect } from 'react';
import { CartStore } from '@/stores/CartStore';
import { observer } from 'mobx-react-lite';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ProfileStore } from '@/stores/ProfileStore';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export interface ICartProduct extends IProduct {
    quantity: number;
}

const Cart: React.FC = observer(() => {
    let { cartStore, profileStore } = useStores();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            if (!cartStore) cartStore = new CartStore();
            if (!profileStore) profileStore = new ProfileStore();
            await Promise.all([
                cartStore?.fetchUserCart(),
                profileStore?.fetchProfile()
            ]);
        };
        fetchData();
    }, [cartStore, profileStore]);

    if (cartStore?.isLoading) return <CartSkeleton />;

    const hasMembership = !!profileStore?.profile?.membership;
    const discountPercentage = 0.1;
    const originalTotal = cartStore?.totalPrice || 0;
    const discountedTotal = hasMembership
        ? originalTotal * (1 - discountPercentage)
        : originalTotal;

    const locale = i18n?.language === 'he' ? 'he-IL' : 'en-US';
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

    return (
        <div className="w-full lg:w-96">
            <div className="bg-[#F2EFED] p-6">
                <h1 className="text-2xl font-amandine mb-6">{t('payment.cart.title')}</h1>

                {/* Cart Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {(!cartStore?.cart?.items || cartStore?.cart?.items.length === 0) ? (
                        <p className="my-4 font-light text-center">{t('payment.cart.empty')}</p>
                    ) : (
                        cartStore?.cart?.items.map((item) => (
                            <CartProductCard
                                key={item.product.id}
                                product={{ ...item.product, quantity: item.quantity }}
                                cartStore={cartStore ?? new CartStore()}
                            />
                        ))
                    )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-300 mt-6 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">{t('payment.cart.total')}:</span>
                        <span className="text-xl font-bold">{formatCurrency(discountedTotal)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Cart;

const CartProductCard: React.FC<{
    product: IProduct & { quantity: number };
    cartStore: CartStore;
}> = observer(({ product, cartStore }) => {
    const { t, i18n } = (require('react-i18next') as any).useTranslation ? (require('react-i18next') as any).useTranslation() : { t: (k:string, o?:any) => k, i18n: { language: 'en' } }; // safe fallback for SSR

    const handleDelete = async () => {
        await cartStore.deleteProductFromCart(product.id);
    };

    const handleIncrease = async () => {
        await cartStore.addToCart(product.id);
    };

    const handleDecrease = async () => {
        await cartStore.deleteProductQuantity(product.id);
    };

    const locale = i18n?.language === 'he' ? 'he-IL' : 'en-US';
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

    return (
        <div className="bg-white p-4 border border-gray-200 relative">
            <button
                onClick={() => handleDelete()}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                aria-label={t('payment.cart.removeItem')}
            >
                <CloseOutlined />
            </button>

            <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                    <Image
                        src={product.images?.[0].imgUrl ?? ""}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">{product.name}</h3>

                    <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                            <span className="mr-2">{t('payment.cart.quantity')}:</span>
                            <button
                                onClick={handleDecrease}
                                className="p-1 rounded-full hover:bg-gray-100"
                                aria-label={t('payment.cart.decreaseQuantity')}
                            >
                                <MinusOutlined />
                            </button>
                            <span className="mx-2">{product.quantity}</span>
                            <button
                                onClick={handleIncrease}
                                className="p-1 rounded-full hover:bg-gray-100"
                                aria-label={t('payment.cart.increaseQuantity')}
                            >
                                <PlusOutlined />
                            </button>
                        </div>

                        {product.material && (
                            <p>
                                {t('payment.cart.material')}: <span className="font-medium">{product.material}</span>
                            </p>
                        )}

                        <p>
                            {t('payment.cart.size')}: <span className="font-medium">{product.size || '-'}</span>
                        </p>
                    </div>

                    <p className="text-right font-semibold mt-2">
                        {t('payment.cart.price')}: {formatCurrency(product.price * product.quantity)}
                    </p>
                </div>
            </div>
        </div>
    );
});

const CartSkeleton: React.FC = () => {
    return (
        <div className="w-full lg:w-96 animate-pulse">
            <div className="bg-[#F2EFED] p-6">
                <div className="h-7 w-24 bg-gray-300 mb-6 rounded"></div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                        <CartProductCardSkeleton key={i} />
                    ))}
                </div>

                <div className="border-t border-gray-300 mt-6 pt-4">
                    <div className="flex justify-between items-center">
                        <div className="h-5 w-20 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const CartProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white p-4 border border-gray-200 relative animate-pulse">
            <div className="absolute top-2 right-2 w-5 h-5 bg-gray-300 rounded-full"></div>

            <div className="flex gap-4">
                {/* Image Skeleton */}
                <div className="w-20 h-20 bg-gray-300 rounded"></div>

                <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gray-300 rounded"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-5 w-20 bg-gray-300 rounded ml-auto"></div>
                </div>
            </div>
        </div>
    );
};
