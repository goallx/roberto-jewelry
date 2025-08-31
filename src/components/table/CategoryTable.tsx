'use client'

import { ICategory } from '@/stores/CategoryStore'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Tooltip, Popconfirm } from 'antd'
import { Loader } from '../loader/Loader'
import type { PopconfirmProps } from 'antd';
import { useStores } from '@/context/StoreContext';
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/helpers';

interface CategoryTableProps {
    categories: ICategory[] | null
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-black uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-5">
                            Category name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Number of Products
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!categories ? (
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
                        categories.map((category: ICategory, index: number) => (
                            <CategoryRow key={index} category={category} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

}

const CategoryRow: React.FC<{ category: ICategory & { createdAt?: string } }> = ({ category }) => {
    const { categoryStore } = useStores()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")


    const handleDelete: PopconfirmProps['onConfirm'] = async () => {
        setError("")
        setLoading(true)
        await categoryStore?.deleteCategory(category.id, (failureMessage) => setError(failureMessage))
        setLoading(false)
    };

    const handleUpdate = () => {
        categoryStore?.setCategoryToUpdate(category)
        categoryStore?.setOpenUpdateCategoryModal(true)
    }

    useEffect(() => {
        if (error) setTimeout(() => setError(""), 2000)
    }, [error])

    return (
        <tr className="bg-white border-b text-black dark:border-gray-700 hover:bg-gray-100 ">
            {
                error &&
                <span className='text-red-500 font-extralight text-sm m-2'>{error}</span>
            }
            <th scope="row" className="flex items-center justify-start gap-5 px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                {
                    category.images.length !== 0 &&
                    <img className="w-10 h-10 rounded-full" src={category.images[0].imgUrl} alt="" />
                }
                {category.name}
            </th>
            <td className="px-6 py-4">
                {category.numOfProducts ?? 0}
            </td>
            <td className="px-6 py-4">
                {formatDate(category.created_at
                    ?? "")}
            </td>
            <td className="px-6 py-4 text-right">
                {
                    loading ?
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                        :
                        <>
                            <Tooltip title="Edit">
                                <Button onClick={handleUpdate} shape='circle' style={{ background: 'transparent', border: 'none' }} icon={<EditOutlined />} />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Delete"
                                    description={`Are you sure you want to delete ${category.name} ?`}
                                    onConfirm={handleDelete}
                                    // onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                    placement='topLeft'
                                >
                                    <Button shape='circle' style={{ background: 'transparent', border: 'none' }} icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </Tooltip>
                        </>
                }
            </td>
        </tr >
    )
}



