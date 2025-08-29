'use client';

import { Loader } from '@/components/loader/Loader';
import { useStores } from '@/context/StoreContext';
import { IProduct } from '@/stores/ProductStore';
import React, { useEffect } from 'react';
import { CartStore } from '@/stores/CartStore';
import { observer } from 'mobx-react-lite';
import { CloseCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export interface ICartProduct extends IProduct {
    quantity: number;
}

const Cart: React.FC = observer(() => {
    const { cartStore, profileStore } = useStores();
    
    useEffect(() => {
        cartStore?.fetchUserCart();
        profileStore?.fetchProfile();
    }, [cartStore, profileStore]);

    if (cartStore?.isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center min-h-full">
                <Loader />
            </div>
        );
    }

    const hasMembership = !!profileStore?.profile?.membership;
    const discountPercentage = 0.1;
    const originalTotal = cartStore?.totalPrice || 0;
    const discountedTotal = hasMembership
        ? originalTotal * (1 - discountPercentage)
        : originalTotal;

    return (
        <div className="w-full bg-[#F2EFED] rounded-lg p-6 shadow-md">
            <h1 className="text-2xl font-semibold mb-6">Cart</h1>

            {/* Cart Items */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {!cartStore?.cart?.items?.length ? (
                    <p className="my-4 font-light text-center">No items in the cart</p>
                ) : (
                    cartStore.cart.items.map((item) => (
                        <CartProductCard
                            key={item.product.id}
                            product={{ ...item.product, quantity: item.quantity }}
                            cartStore={cartStore}
                        />
                    ))
                )}
            </div>

            {/* Total */}
            <div className="border-t border-gray-300 mt-6 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    {hasMembership ? (
                        <div className="text-right">
                            <div className="line-through text-gray-500 text-sm">
                                {originalTotal.toLocaleString('en-US')}$
                            </div>
                            <div className="text-green-600 text-xl font-bold">
                                {discountedTotal.toLocaleString('en-US')}$
                            </div>
                            <div className="text-xs text-gray-400">(10% membership discount)</div>
                        </div>
                    ) : (
                        <span className="text-xl font-bold">
                            {originalTotal.toLocaleString('en-US')}$
                        </span>
                    )}
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
    const handleDelete = async () => {
        await cartStore.deleteProductFromCart(product.id);
    };

    const handleIncrease = async () => {
        await cartStore.addToCart(product.id);
    };

    const handleDecrease = async () => {
        await cartStore.deleteProductQuantity(product.id);
    };

    return (
        <div className="bg-[#D9D9D9] rounded-lg p-4 relative">
            {/* Delete button */}
            <Button
                onClick={handleDelete}
                shape="circle"
                style={{
                    background: 'transparent',
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                }}
                icon={<CloseCircleOutlined />}
            />

            <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-2">{product.name}</h3>

                {/* Details */}
                <div className="space-y-1 text-sm text-gray-600">
                    <p>
                        Quantity:
                        <Button
                            shape="circle"
                            size="small"
                            style={{ background: 'transparent', margin: '0 8px' }}
                            icon={<MinusOutlined />}
                            onClick={handleDecrease}
                        />
                        {product.quantity}
                        {product.quantity < product.stock && (
                            <Button
                                shape="circle"
                                size="small"
                                style={{ background: 'transparent', marginLeft: '8px' }}
                                icon={<PlusOutlined />}
                                onClick={handleIncrease}
                            />
                        )}
                    </p>

                    {product.material && (
                        <p>
                            Material: <span className="font-medium">{product.material}</span>
                        </p>
                    )}

                    <p>
                        Size: <span className="font-medium">{product.size || '-'}</span>
                    </p>
                </div>

                {/* Price */}
                <p className="text-right font-semibold mt-2">
                    Price: {(product.price * product.quantity).toLocaleString('en-US')}$
                </p>
            </div>
        </div>
    );
});
