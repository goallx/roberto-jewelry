"use client";

import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { CustomizedButton } from "@/components/ui/customized-button/CustomizedButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStores } from "@/context/StoreContext";
import { OrderStore } from "@/stores/OrderStore";
import { PageLoader } from "@/components/loader/PageLoader";
import { toJS } from "mobx";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const transactionUid = searchParams.get("transaction_uid");
    const orderId = searchParams.get("order_id");
    let { orderStore } = useStores()
    const [orderSummary, setOrderSummary] = useState<{ items: Array<{ name: string, quantity: number, price: number }>, total: number }>({
        items: [],
        total: 0
    })
    const [isLoading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const getOrders = async () => {
            setLoading(true)
            if (!orderStore) orderStore = new OrderStore()
            const orders = await orderStore.fetchUserOrders()
            const order = orders?.filter(order => order._id.toString() === orderId)
            if (order && order.length) {
                const orderDetails = toJS(order[0])
                const items = orderDetails.items.map(item => (
                    {
                        name: item.product?.name ?? "",
                        quantity: item.quantity,
                        price: item.product.price
                    }
                ))
                setOrderSummary({ items, total: orderDetails.total })
            }
            setLoading(false)
        }
        getOrders()
    }, [orderId])



    if (!transactionUid || !orderId) {
        router.back()
        return
    }


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <PageLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">

                <div className="flex justify-center">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-16 h-16 text-green-500"
                    />
                </div>

                <h1 className="text-2xl font-bold text-center mt-4">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    Thank you for your purchase. Your order has been successfully processed.
                </p>

                <div className="mt-6 border-t border-b py-4">
                    <h2 className="text-lg font-semibold">Order Summary</h2>
                    <div className="mt-2 space-y-2">
                        {orderSummary.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-600">
                                    {item.name} (x{item.quantity})
                                </span>
                                <span className="font-semibold">${item.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 pt-2 border-t">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-semibold">
                            ${orderSummary.total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 mb-4">
                    <h2 className="text-lg font-semibold">Transaction Details</h2>
                    <div className="mt-2 space-y-1">
                        <p>
                            <span className="text-gray-600">Transaction UID:</span>{" "}
                            <span className="font-semibold">{transactionUid}</span>
                        </p>
                        <p>
                            <span className="text-gray-600">Order ID:</span>{" "}
                            <span className="font-semibold">{orderId}</span>
                        </p>
                    </div>
                </div>

                <CustomizedButton onClick={() => router.push('/')} title="Continue Shopping" />
            </div>
        </div>
    );
}