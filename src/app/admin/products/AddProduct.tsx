'use client'

import FilesUpload from "@/components/files-upload/FilesUpload";
import { Loader } from "@/components/loader/Loader";
import { useAlert } from "@/context/AlertsContext";
import { useStores } from "@/context/StoreContext";
import { CategoryStore, ICategory } from "@/stores/CategoryStore";
import { INewProduct, ProductStore } from "@/stores/ProductStore";
import { genderOptions, materialOptions } from "@/stores/consts";
import UploadsManager from "@/utils/UploadsManager";
import { Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";


const AddProduct = observer(({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [status, setStatus] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [images, setImages] = useState<File[]>([])
    const [category, setCategory] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [size, setSize] = useState<number>(0)
    const [material, setMaterial] = useState<string>("")
    const [gender, setGender] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    let { categoryStore, productStore } = useStores()
    const { showAlert } = useAlert()

    const categoryOptions = categoryStore?.categories?.map((category: ICategory) => (
        {
            label: category.name,
            value: category.name
        }
    ))

    useEffect(() => {
        if (!categoryStore) categoryStore = new CategoryStore()
        if (!productStore) productStore = new ProductStore()


    }, [categoryStore, productStore])

    useEffect(() => {
        categoryStore?.fetchCategories()
    }, [])

    useEffect(() => {
        if (!name || !category || !quantity || !price || !size || !images.length || !material || !description || !gender) {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [name, category, quantity, price, size, images, material, description])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (loading) return
        setLoading(true)
        if (!images.length) {
            setStatus("Please select at least 1 image");
            setLoading(false)
            return;
        }

        const uploadedImages = await UploadsManager.uploadImages(images)

        const newProduct: INewProduct = {
            name,
            price,
            quantity,
            images: uploadedImages,
            category,
            size,
            gender,
            material,
            description
        }
        await productStore?.addProduct(
            newProduct,
            async () => {
                await categoryStore?.updateCategoryNumberOfProducts(newProduct.category, newProduct.quantity)
                showAlert(`${newProduct.name} added successfuly!`, 'success')
                onClose()
                return
            },
            (err: any) => {
                setStatus((err || err.message) ?? "Something went wrong, please refresh the page and try again!")
                showAlert(`Failed to add ${newProduct.name}!`, 'error')
                return
            })
        setLoading(false)
    };


    return (
        <div
            id="default-modal"
            className={`${visible ? 'flex' : 'hidden'
                } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen md:inset-0  bg-black/30 backdrop-blur-sm`}
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 ">
                            Add Product
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-black hover:bg-gray-200"
                            data-modal-hide="default-modal"
                            onClick={onClose}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-4 md:p-5 space-y-4">
                            {status && <p className="text-sm text-red-500">{status}</p>}
                            <div className="flex justify-start gap-5 items-center">

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                    <input style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }} disabled={loading} defaultValue={name} onChange={(e) => setName(e.target.value)} required type="text" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5" />
                                </div>
                                <div className="items-center">
                                    {
                                        categoryStore?.categories?.length === 0 ?
                                            <p>No categories, add one</p>
                                            :
                                            <>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                                                <Select
                                                    disabled={loading}
                                                    allowClear
                                                    style={{ minWidth: '170px' }}
                                                    size="large"
                                                    defaultValue={category}
                                                    onChange={(value) => setCategory(value)}
                                                    options={categoryOptions}
                                                />
                                            </>
                                    }
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Price</label>
                                    <input style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }} disabled={loading} defaultValue={name} min={0} onChange={(e) => setPrice(Number(e.target.value))} required type="number" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5   dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Size</label>
                                    <input style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }} disabled={loading} defaultValue={name} min={0} onChange={(e) => setSize(Number(e.target.value))} required type="number" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5   dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
                                    <input style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }} disabled={loading} defaultValue={name} min={0} onChange={(e) => setQuantity(Number(e.target.value))} required type="number" aria-describedby="helper-text-explanation" className=" block w-22 p-2.5  bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300  dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                                    <Select
                                        disabled={loading}
                                        allowClear
                                        style={{ minWidth: '170px' }}
                                        size="large"
                                        defaultValue={gender}
                                        onChange={(value) => setGender(value)}
                                        options={genderOptions}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Material</label>
                                    <Select
                                        disabled={loading}
                                        allowClear
                                        style={{ minWidth: '170px' }}
                                        size="large"
                                        defaultValue={material}
                                        onChange={(value) => setMaterial(value ?? "")}
                                        options={materialOptions}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                <TextArea disabled={loading} onChange={(e) => setDescription(e.target.value)} autoSize={{ minRows: 2, maxRows: 6 }} />
                            </div>
                            <FilesUpload onError={(err) => setStatus(err)} onUpload={(images) => setImages(images)} />
                        </div>
                        <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button
                                onClick={onClose}
                                data-modal-hide="default-modal"
                                type="button"
                                className="text-black dark:hover:text-black hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDisabled}
                                data-modal-hide="default-modal"
                                type="submit"
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-white bg-black focus:outline-none rounded-lg border border-gray-200  focus:z-10 focus:ring-4 focus:ring-gray-100"
                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', color: loading ? 'gray' : "" }}
                            >
                                <span className="flex justify-evenly items-center gap-2">
                                    {
                                        loading ?
                                            <Loader /> : null
                                    }
                                    Add Product
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
})

export default AddProduct;
