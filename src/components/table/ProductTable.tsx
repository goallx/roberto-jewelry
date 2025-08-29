'use client'
import { useStores } from '@/context/StoreContext'
import { IProduct, ProductStore } from '@/stores/ProductStore'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { Loader } from '../loader/Loader'
import { CategoryStore } from '@/stores/CategoryStore'
import { formatDate } from '@/utils/helpers'
import { BlurImage } from '../blur-image/BlurImage.component'

interface ProductTableProps {
    products: Array<IProduct> | null
}


export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {

    return (
        <div className="h-auto max-h-[90%] overflow-x-auto shadow-md sm:rounded-lg ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-black uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-5">
                            Code
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className='h-[70vh]'>
                    {!products ? (
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
                        products.map((product: any, index: number) => (
                            <ProductRow key={index} product={product} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

}

const ProductRow: React.FC<{ product: IProduct }> = ({ product }) => {
    const [loading, setLoading] = useState<boolean>(false)
    let { productStore, categoryStore } = useStores()

    const handleDeleteProduct = async () => {
        if (!productStore) productStore = new ProductStore()
        setLoading(true)
        try {
            await productStore.deleteProduct(product.id)
            await categoryStore?.updateCategoryNumberOfProducts(product.categoryName || "", (-product.stock))
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProduct = () => {
        productStore?.setOpenUpdateProductModal(true)
        productStore?.setProductToUpdate(product)
    }

    return (
        <tr className="bg-white border-b text-black dark:border-gray-700 hover:bg-gray-100 ">
            <td className="px-6 py-4">
                {product.id}
            </td>
            <th scope="row" className="flex items-center justify-start gap-5 px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                <BlurImage
                    src={product.images[0].imgUrl}
                    alt={product.name}
                    className="rounded-full w-14"
                    loading="lazy"
                />
                {product.name}
            </th>
            <td className="px-6 py-4">
                {product.stock}
            </td>
            <td className="px-6 py-4">
                {formatDate(product.created_at ?? "")}
            </td>
            <td className="px-6 py-4">
                {product.price.toLocaleString('en-US')}
            </td>
            <td className="px-6 py-4">
                {product.categoryName}
            </td>
            <td className="px-6 py-4" style={{ color: product.stock > 0 ? 'black' : 'red' }}>
                {product.stock > 0 ? "Active" : "Disactivated"}
            </td>
            <td className="px-6 py-4 text-right">
                {
                    loading ?
                        <Loader />
                        :
                        <>
                            <Tooltip title="Edit">
                                <Button onClick={handleUpdateProduct} shape='circle' style={{ background: 'transparent', border: 'none' }} icon={<EditOutlined />} />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Delete"
                                    description={`Are you sure you want to delete ${product.name} ?`}
                                    onConfirm={handleDeleteProduct}
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



