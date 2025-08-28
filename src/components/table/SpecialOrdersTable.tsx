import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { Customise } from '@/models/customise';
import { Loader } from '../loader/Loader';
import Image from 'next/image';
import { formatDate } from '@/utils/helpers';

interface DataType {
    key: React.Key;
    email: string;
    fullName: string
    date: string;
    seen: boolean
}

const columns: TableColumnsType<DataType> = [
    {
        title: "",
        dataIndex: 'seen',
        render: (opened: boolean) => {
            if (opened) {
                return (
                    <div className="w-2 h-2 rounded-[50%] bg-gray-300" />
                )
            }
            return (
                <div className="w-2 h-2 rounded-[50%] bg-green-500" />
            )
        }
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Full name',
        dataIndex: 'fullName',
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
];

const SpecialOrdersTable: React.FC = () => {
    const [customiseOrders, setCustomiseOrders] = useState<DataType[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedOrder, setSelectedOrder] = useState<Customise | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/customise', { method: 'GET', credentials: 'include' });
                const data = await response.json();
                if (response.ok) {
                    const { data: specialOrders } = data;
                    const transformedSubscribers = specialOrders.map((order: Customise) => ({
                        key: order._id,
                        email: order.email,
                        date: formatDate(order.createdAt ?? new Date().toISOString()),
                        fullName: order.fullName,
                        seen: order.opened
                    }));
                    setCustomiseOrders(transformedSubscribers);
                } else {
                    setError('Failed to fetch subscribers.');
                }
            } catch (err: any) {
                setError(err.message || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const fetchSelectedOrder = async (orderId: string) => {
        setIsModalOpen(true)
        setLoading(true)
        try {
            const response = await fetch(`/api/customise?id=${orderId}`, { method: 'GET', credentials: 'include' })
            const data = await response.json()
            if (response.ok) {
                const { data: order } = data
                setSelectedOrder(order)
            } else {
                setSelectedOrder(null)
            }
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoading(false)
            updateOrderOpenedStatus(orderId)
        }
    }

    const updateOrderOpenedStatus = async (orderId: string) => {
        try {
            const response = await fetch(`/api/customise?id=${orderId}`, { method: 'PUT', credentials: 'include' })
            if (response.ok) {
                setCustomiseOrders((prev) => {
                    return prev.map(order => {
                        if (order.key === orderId)
                            order.seen = true
                        return order
                    })
                })
            } else {
                setSelectedOrder(null)
            }
        } catch (err: any) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex flex-col gap-5">
            {error && <p className="text-red-500">{error}</p>}
            <Table<DataType>
                columns={columns}
                dataSource={customiseOrders}
                loading={isLoading}
                onRow={
                    ({ key }) => ({
                        onClick: async () => fetchSelectedOrder(key as string),
                        onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f5f5f5'),
                        onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = ''),
                        style: { cursor: 'pointer' },
                    })}
            />
            <Modal
                title="Order Details"
                open={isModalOpen}
                styles={{
                    body: {
                        height: 500,
                    }
                }}
                onCancel={() => {
                    setIsModalOpen(false)
                    setSelectedOrder(null)
                }}
                footer={null}
            >
                <div className="h-full w-full p-4">
                    {
                        isLoading ?
                            <Loader />

                            :
                            selectedOrder &&
                            <div className='h-full flex flex-col justify-start gap-3 mt-5 overflow-y-auto'>
                                <div className="flex gap-2">
                                    <label className="font-light flex-[0.3]">Order ID</label>
                                    <p className="font-medium self-start  flex-[0.7]">{selectedOrder._id as string}</p>
                                </div>
                                <div className="flex gap-2">
                                    <label className="font-light flex-[0.3]">Email</label>
                                    <p className="font-medium self-start flex-[0.7]">{selectedOrder.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <label className="font-light flex-[0.3]">Material</label>
                                    <p className="font-medium self-start flex-[0.7]">{selectedOrder.material}</p>
                                </div>
                                <div className="flex gap-2">
                                    <label className="font-light flex-[0.3]">Category</label>
                                    <p className="font-medium self-start flex-[0.7]">{selectedOrder.category}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-light flex-[0.3]">Additional details</label>
                                    <p className="font-medium self-start w-full flex-[0.7]">{selectedOrder.additional}</p>
                                </div>
                                <div className="flex flex-col gap-2 mt-7">
                                    <div className='flex justify-between'>
                                        <label className='font-light'>Attachments</label>
                                        <p>{selectedOrder.images.length} files</p>
                                    </div>
                                    <div className='flex gap-2 justify-start items-center overflow-x-auto'>
                                        {
                                            selectedOrder.images.map((img, index) =>
                                                <Image key={index} src={img.imgUrl} alt={img.fileName} width={150} height={150} />
                                            )
                                        }
                                    </div>

                                </div>
                            </div>
                    }
                </div>
            </Modal>
        </div>
    );
};

export default SpecialOrdersTable;
