'use client'

import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Input } from "antd"
import { ProductTable } from '@/components/table/ProductTable'
import AddProduct from './AddProduct'
import { useStores } from '@/context/StoreContext'
import { IProduct, ProductStore } from '@/stores/ProductStore'
import UpdateProduct from './UpdateProduct'

import { Loader } from '@/components/loader/Loader'


const Products = observer(() => {

    const [openAddProduct, setOpenAddProduct] = useState<boolean>(false)
    let { productStore } = useStores()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!productStore) productStore = new ProductStore()
        else
            productStore.fetchProducts()
        setLoading(false)
    }, [productStore])

    if (loading || !productStore) return <Loader />

    const filterProducts = productStore.products?.filter((product: IProduct) => product.name.toLocaleLowerCase().includes(searchQuery)) ?? null

    return (
        <>
            {
                productStore.openUpdateProductModal &&
                <UpdateProduct />
            }
            {
                openAddProduct &&
                <AddProduct onClose={() => setOpenAddProduct(false)} visible={openAddProduct} />
            }
            <div className="container px-6 py-4 bg-white h-[96vh] max-h-[96vh] rounded-2xl flex flex-col gap-4">
                <div className="flex flex-col gap-6 w-full h-[100px]">
                    <h1 className="text-2xl font-medium">Products</h1>
                    <div className="flex justify-between items-center">
                        <Input onChange={(e) => setSearchQuery(e.target.value.toLocaleLowerCase())} style={{ width: 250 }} placeholder='Search by name' prefix={<SearchOutlined />} />
                        <span data-modal-toggle="default-modal" onClick={() => setOpenAddProduct(true)} className="flex text-base justify-between items-center gap-2 rounded-3xl px-4 py-2 cursor-pointer font-light hover:bg-slate-100"><PlusOutlined />Add Product</span>
                    </div>
                </div>
                <ProductTable products={searchQuery ? filterProducts : productStore.products} />
            </div>
        </>
    )
})
export default Products