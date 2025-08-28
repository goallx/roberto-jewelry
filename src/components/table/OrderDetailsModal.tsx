import { Modal, Select, message } from 'antd';
import { formatDate } from '@/utils/helpers'; // Assuming you have a date formatter utility
import { IOrderWithProduct } from '@/stores/OrderStore';
import { useState } from 'react';
import { Loader } from '../loader/Loader';
import { useAlert } from '@/context/AlertsContext';
import { OrderStatus } from '@/models/Order';

interface OrderDetailsProps {
    onClose: () => void;
    order: IOrderWithProduct;
}

export const OrderDetailsModal: React.FC<OrderDetailsProps> = ({ onClose, order }) => {
    const [orderStatus, setOrderStatus] = useState<string>(order.orderStatus);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const { showAlert } = useAlert()

    const handleStatusChange = async (value: string) => {
        setIsUpdating(true);
        setOrderStatus(value);
        try {
            const response = await fetch('/api/order/status',
                {
                    method: "PUT",
                    body: JSON.stringify({ orderId: order._id, orderStatus: value })
                })
            if (response.ok) {
                order.orderStatus = value as any
                showAlert(`Order status updated to ${value}`, 'success')
            } else {
                showAlert(`Faild to update order status to ${value}`, 'error')
            }
        } catch (error) {

        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Modal
            title="Order Details"
            open={true}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
        >
            <div className="space-y-6">

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Order ID:</strong> #{order._id}
                        </div>
                        <div>
                            <strong>Order Date:</strong> {formatDate(order.createdAt)}
                        </div>
                        <div>
                            <strong>Total Amount:</strong> ${order.total}
                        </div>
                        <div>
                            <strong>Payment Method:</strong> {order.paymentMethod}
                        </div>
                        <div>
                            <strong>Payment Status:</strong>{" "}
                            <span
                                className={`font-semibold ${order.paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div>
                            <strong>Order Status:</strong>{" "}
                            {
                                isUpdating ?
                                    <Loader />
                                    :
                                    <Select
                                        value={orderStatus}
                                        defaultValue={orderStatus}
                                        onChange={handleStatusChange}
                                        loading={isUpdating}
                                        className="w-40"
                                    >
                                        <Select.Option value="pending">Pending</Select.Option>
                                        <Select.Option value="processing">Processing</Select.Option>
                                        <Select.Option value="shipped">Shipped</Select.Option>
                                        <Select.Option value="delivered">Delivered</Select.Option>
                                        <Select.Option value="cancelled">Cancelled</Select.Option>
                                    </Select>
                            }
                        </div>
                    </div>
                </div>

                {/* Customer Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-black mb-4">Customer Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Name:</strong> {order.customerId.firstName} {order.customerId.lastName}
                        </div>
                        <div>
                            <strong>Email:</strong> {order.customerId.email}
                        </div>
                        <div>
                            <strong>Phone:</strong> {order.customerId.phoneNumber}
                        </div>
                    </div>
                </div>

                {/* Billing Address Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-black mb-4">Billing Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Street:</strong> {order.billingAddress.street}
                        </div>
                        <div>
                            <strong>City:</strong> {order.billingAddress.city}
                        </div>
                        <div>
                            <strong>ZIP Code:</strong> {order.billingAddress.zip}
                        </div>
                        <div>
                            <strong>Country:</strong> {order.billingAddress.country}
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-black mb-4">Products</h2>
                    <div className="space-y-4">
                        {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={item.product?.images[0]?.imgUrl || 'https://via.placeholder.com/100'}
                                            alt={`Product ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-black">{item.product?.name || 'Product Name'}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-black">${item.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};