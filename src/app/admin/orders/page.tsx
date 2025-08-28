'use client'

import { OrdersTable } from "@/components/table/OrdersTable";
import { useStores } from "@/context/StoreContext";
import { IOrderWithProduct, OrderStore } from "@/stores/OrderStore";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const Orders = observer(() => {
    let { orderStore } = useStores()
    const [orders, setOrders] = useState<IOrderWithProduct[] | null>(null)
    const [filteredOrders, setFilteredOrders] = useState<IOrderWithProduct[] | null>(null)
    const [query, setQuery] = useState<string>("")

    useEffect(() => {
        const loadOrders = async () => {
            const allOrders = await orderStore?.fetchAllOrders()
            setOrders(() => allOrders ?? [])
        }
        if (!orderStore) orderStore = new OrderStore()
        loadOrders()
    }, [orderStore])

    useEffect(() => {
        if (query) {
            const filtered = [...(orders || [])].filter(order => order._id.includes(query));
            setFilteredOrders(filtered)
        } else {
            setFilteredOrders(null)
        }
    }, [query, orders]);

    if (!orderStore || !orders) return null

    return (
        <div className="h-full flex flex-col gap-5">
            <h1 className="text-2xl font-medium">Orders</h1>
            <div className="container px-6 py-6 bg-white h-full rounded-2xl">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">Latest Orders</p>
                        <Input
                            onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
                            style={{ width: 250 }} placeholder='Search by order ID' prefix={<SearchOutlined />} />
                    </div>
                    <OrdersTable orders={filteredOrders ?? orders} />
                </div>
            </div>
        </div>
    )
})

export default Orders