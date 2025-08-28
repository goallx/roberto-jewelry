'use client'

import { Breadcrumb } from "@/components/breadcrumbs/Breadcrumb"
import { Loader } from "@/components/loader/Loader"
import { useStores } from "@/context/StoreContext"
import { IOrderWithProduct, OrderStore } from "@/stores/OrderStore"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IProduct } from "@/stores/ProductStore"
import { formatDate } from "@/utils/helpers"
import { Badge } from "antd"
import { OrderPaymentStatus, OrderStatus } from "@/models/Order"


const Orders: React.FC = () => {
    let { orderStore } = useStores()
    const [orders, setOrders] = useState<IOrderWithProduct[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const getOrders = async () => {
            setLoading(true)
            if (!orderStore) orderStore = new OrderStore()
            const orders = await orderStore.fetchUserOrders()
            setOrders(orders ?? [])
            setLoading(false)
        }
        getOrders()
    }, [orderStore])


    if (!orderStore) return null

    return (
        <div className="h-full mt-24 flex flex-col justify-start gap-5">
            <div className="mt-4 px-8">
                <Breadcrumb />
            </div>
            <div>
                <div className="min-h-[30vh] w-[90vw] md:w-[60vw] m-auto mt-10 mb-10 p-5 shadow-md rounded-2xl">
                    <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
                    {
                        loading ?
                            <div className="flex justify-center">
                                <Loader />
                            </div>
                            :
                            orders?.length === 0 ?
                                <h1 className="m-auto text-center font-semibold">You have no orders!</h1>
                                :
                                orders.map((order: IOrderWithProduct, index: number) => (
                                    <>
                                        <OrderPageCard order={order} key={order._id} />
                                        {
                                            index < orders.length && (
                                                <div key={index + 1} className="h-[2px] bg-gray-200 w-[70%] m-auto mb-10" />
                                            )
                                        }
                                    </>
                                ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Orders


const OrderPageCard: React.FC<{ order: IOrderWithProduct }> = ({ order }) => {
    const router = useRouter();

    // Determine badge text and color based on payment status
    let paymentBadgeText: string = "";
    let paymentBadgeColor: string = "green";

    switch (order.paymentStatus) {
        case OrderPaymentStatus.SUCCESS:
            paymentBadgeText = "Order Placed";
            paymentBadgeColor = "green";
            break;
        default:
            paymentBadgeText = "Order Not Completed";
            paymentBadgeColor = "red";
    }


    let orderStatusText: string = "";
    let orderStatusColor: string = "blue";

    switch (order.orderStatus) {
        case OrderStatus.PENDING:
            orderStatusText = "Pending";
            orderStatusColor = "orange";
            break;
        case OrderStatus.SHIPPED:
            orderStatusText = "Shipped";
            orderStatusColor = "blue";
            break;
        case OrderStatus.DELIVERED:
            orderStatusText = "Delivered";
            orderStatusColor = "green";
            break;
        case OrderStatus.CANCELLED:
            orderStatusText = "Cancelled";
            orderStatusColor = "red";
            break;
        default:
            orderStatusText = "Processing";
            orderStatusColor = "gray";
    }

    const handleProductNavigation = async (product: IProduct) => {
        const pathName = `/products/${product.categoryName.toLocaleLowerCase()}?id=${product._id}`;
        router.push(pathName);
    };

    return (
        <Badge.Ribbon color={paymentBadgeColor} text={paymentBadgeText}>
            <div className="flex flex-col gap-4 justify-start items-start font-semibold min-h-48 mb-14 bg-[rgba(0,0,0,0.05)] rounded-2xl px-4 py-8">
                {/* Order Number and Date */}
                <div className="flex-[0.2] w-full flex flex-col justify-start items-start px-4 py-1 text-base gap-4 md:flex-row md:justify-between md:items-center">
                    <div className="flex flex-col gap-2 font-thin md:flex-row md:justify-start">
                        <label>Order Number:</label>
                        <p>{order?._id}</p>
                    </div>
                    <p>{formatDate(order?.createdAt)}</p>
                </div>

                {/* Order Status */}
                <div className="w-full px-4 flex flex-col gap-1">
                    <label className="font-thin">Order status</label>
                    <Badge
                        color={orderStatusColor}
                        text={orderStatusText}
                        className="text-sm font-semibold"
                    />
                </div>

                {/* Product Images */}
                <div className="flex overflow-x-auto gap-8 w-full h-auto p-3 flex-[0.6] border-t-[0.5px] border-b-[0.5px] border-gray-300">
                    {order?.items.map((item, index) => (
                        <Image
                            onClick={() => handleProductNavigation(item.product)}
                            key={index}
                            width={190}
                            height={190}
                            className="object-contain shadow-lg cursor-pointer"
                            src={item.product?.images[0].imgUrl}
                            alt={`${item}-img`}
                        />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="flex-[0.2] w-full flex justify-between items-center px-4 py-1">
                    <p>{order.items.length} items</p>
                    <div className="flex flex-start gap-2">
                        <label>Total:</label>
                        <p>${order?.total.toLocaleString('en-UN')}</p>
                    </div>
                </div>
            </div>
        </Badge.Ribbon>
    );
};