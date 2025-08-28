'use client'
import { CategoryTable } from "@/components/table/CategoryTable"
import { useStores } from "@/context/StoreContext"
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react"
import AddCategory from "./AddCategory"
import { observer } from "mobx-react-lite"
import UpdateCategory from "./UpdateCategory"
import { CategoryStore } from "@/stores/CategoryStore"


const Categories = observer(() => {
    let { categoryStore } = useStores()
    const [openAddCategory, setOpenAddCategory] = useState<boolean>(false)

    useEffect(() => {
        if (!categoryStore) categoryStore = new CategoryStore()
        categoryStore?.fetchCategories()
    }, [categoryStore])

    if (!categoryStore) return null

    return (
        <>
            {
                categoryStore?.openUpdateCategoryModal &&
                <UpdateCategory />
            }
            {
                openAddCategory &&
                <AddCategory onClose={() => setOpenAddCategory(false)} visible={openAddCategory} />
            }
            <div className="container px-6 py-6 bg-white h-full rounded-2xl">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-medium">Categories</h1>
                        <span data-modal-toggle="default-modal" onClick={() => setOpenAddCategory(true)} className="flex text-base justify-between items-center gap-2 rounded-3xl px-4 py-2 cursor-pointer font-light hover:bg-slate-100"><PlusOutlined />Add Category</span>
                    </div>
                    <CategoryTable categories={categoryStore?.categories} />
                </div>
            </div>
        </>
    )
})
export default Categories