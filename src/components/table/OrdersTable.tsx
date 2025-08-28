import { useState } from 'react';
import { Loader } from '../loader/Loader'
import { IOrderWithProduct } from '@/stores/OrderStore'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from 'antd';
import { OrderProductsModal } from './OrderProductsModal';
import Image from 'next/image';
import { formatDate } from '@/utils/helpers';
import { OrderDetailsModal } from './OrderDetailsModal';


interface OrdersTableProps {
    orders: IOrderWithProduct[] | null
}


export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {

    return (
        <div className="h-auto max-h-[90%] overflow-x-auto shadow-md sm:rounded-lg ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-black uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-5">
                            Order ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Products
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Customer
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Revenue
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Order Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!orders ? (
                        <tr>
                            <td colSpan={8} className="text-center py-6">
                                <div className="text-center flex justify-center">
                                    <div role="status">
                                        <Loader />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        orders.map((order: IOrderWithProduct, index: number) => (
                            <OrderRow key={index} order={order} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

}

const OrderRow: React.FC<{ order: IOrderWithProduct }> = ({ order }) => {
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

    return (
        <>
            {/* Modal for viewing products */}
            {showProductModal && (
                <OrderProductsModal
                    products={order.items}
                    onClose={() => setShowProductModal(false)}
                />
            )}

            {showOrderModal && (
                <OrderDetailsModal
                    order={order}
                    onClose={() => setShowOrderModal(false)}
                />
            )}

            <tr className="bg-white font-light border-b text-black dark:border-gray-700 hover:bg-gray-100">
                <td className="px-6 py-4">#{order._id as any}</td>
                <td className="px-6 py-4 relative flex justify-start gap-5 items-center">
                    <div className="grid grid-cols-2 gap-2">
                        {order.items.slice(0, 4).map((item, index) => (
                            <Image
                                src={item.product?.images[0].imgUrl}
                                alt={`image ${index}`}
                                width={120}
                                height={120}
                                key={index}
                                className="w-11 h-11 object-cover rounded-full"
                            />
                        ))}
                    </div>
                    <span>{order.items.length} items</span>
                    <Tooltip title="See products">
                        <FontAwesomeIcon
                            onClick={() => setShowProductModal(true)}
                            color="gray"
                            className="cursor-pointer"
                            icon={faEye}
                        />
                    </Tooltip>
                </td>
                <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4">
                    {`${order.customerId?.firstName ?? ""} ${order.customerId?.lastName ?? ""}`}
                </td>
                <td className="px-6 py-4">${order.total.toLocaleString()}</td>
                <td className="px-6 py-4">{order.orderStatus}</td>
                <td className="px-6 py-4 font-medium">
                    <button
                        onClick={() => setShowOrderModal(true)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View Order
                    </button>
                </td>
            </tr>
        </>
    );
};



