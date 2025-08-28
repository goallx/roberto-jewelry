'use client'

import FilesUpload from "@/components/files-upload/FilesUpload";
import { Loader } from "@/components/loader/Loader";
import { useStores } from "@/context/StoreContext";
import { CategoryStore, ICategory } from "@/stores/CategoryStore";
import { IProduct, ProductStore } from "@/stores/ProductStore";
import UploadsManager from "@/utils/UploadsManager";
import { Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { genderOptions } from "@/stores/consts";
import { useAlert } from "@/context/AlertsContext";


const UpdateProduct: React.FC = observer(() => {

    const [productToUpdate, setProductToUpdate] = useState<IProduct>()
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [status, setStatus] = useState<string>("")
    const [images, setImages] = useState<File[]>([])
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
    const [optionsForCategory, setOptionsForCategory] = useState<{ label: string, value: string }[] | null>(null)
    const [fetchingCategories, setFetchingCategories] = useState<boolean>(false);
    let { categoryStore, productStore } = useStores()
    const { showAlert } = useAlert()

    useEffect(() => {
        if (!categoryStore) {
            categoryStore = new CategoryStore()
            categoryStore.fetchCategories()
        }
        if (!productStore) productStore = new ProductStore()
    }, [categoryStore, productStore])

    if (!categoryStore || !productStore) return null

    useEffect(() => {
        const prepareCategoryOptions = async () => {
            setFetchingCategories(true);
            try {
                if (!categoryStore) categoryStore = new CategoryStore()
                await categoryStore.fetchCategories();
                const options = categoryStore.categories?.map((category: ICategory) => ({
                    label: category.name,
                    value: category._id,
                }));
                setOptionsForCategory(options ?? null);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setStatus("Failed to fetch categories");
            } finally {
                setFetchingCategories(false);
            }
        };

        if (!optionsForCategory)
            prepareCategoryOptions()

    }, [categoryStore]);


    useEffect(() => {
        if (productStore && productStore.productToUpdate) {
            setProductToUpdate({ ...toJS(productStore?.productToUpdate) })
        }
    }, [productStore.productToUpdate])



    useEffect(() => {
        if (!productToUpdate?.name || !productToUpdate.gender || !productToUpdate?.category || !productToUpdate?.stock || !productToUpdate?.price || !productToUpdate?.size || !productToUpdate?.images.length) {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [productToUpdate])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        if (!productToUpdate) {
            setLoading(false)
            return
        }
        if (imagesToDelete.length) {
            await UploadsManager.deleteImages(imagesToDelete)
        }

        let uploadedImages;
        if (images.length) {
            uploadedImages = await UploadsManager.uploadImages(images)
        }

        await productStore?.updateProduct(
            { ...productToUpdate, imagesToDelete, images: uploadedImages ?? [] },
            //onerror
            (err: any) => {
                setStatus(err ?? err?.message ?? "Something went wrong, try again please")
                showAlert(`Failed to update ${productToUpdate.name}`, 'error')
                return
            },
            //onsuccess
            () => {
                categoryStore?.refetchCategories()
                showAlert(`${productToUpdate.name} has been updated successfuly!`, 'success')
                return
            })
        setLoading(false)
    };


    return (
        <div
            id="default-modal"
            className={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen md:inset-0  bg-black/30 backdrop-blur-sm`}
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 ">
                            Update Product
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="default-modal"
                            onClick={() => productStore?.setOpenUpdateProductModal(false)}
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
                                    <input
                                        style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }}
                                        defaultValue={productToUpdate?.name}
                                        onChange={(e) => setProductToUpdate(productToUpdate && { ...productToUpdate, name: e.target.value })}
                                        required
                                        type="text" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5   dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                                <div className="items-center">
                                    {
                                        categoryStore?.categories?.length === 0 ?
                                            <p>No categories, add one</p>
                                            :
                                            <>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                                                {
                                                    fetchingCategories ?
                                                        <Loader />
                                                        :
                                                        <Select
                                                            allowClear
                                                            disabled={loading}
                                                            style={{ minWidth: '170px' }}
                                                            size="large"
                                                            defaultValue={productToUpdate?.category}
                                                            value={productToUpdate?.category}
                                                            onChange={(value) => {
                                                                const cat = optionsForCategory?.find((cat) => cat.value === value)
                                                                if (productToUpdate && cat)
                                                                    setProductToUpdate({ ...productToUpdate, categoryName: cat.label, category: value })
                                                            }}
                                                            options={optionsForCategory ?? []}
                                                        />
                                                }
                                            </>

                                    }
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Price</label>
                                    <input
                                        style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }}
                                        defaultValue={productToUpdate?.price} min={0}
                                        onChange={(e) => setProductToUpdate(productToUpdate && { ...productToUpdate, price: Number(e.target.value) })}
                                        required type="number" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5   dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Size</label>
                                    <input
                                        style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }}
                                        defaultValue={productToUpdate?.size}
                                        min={0}
                                        onChange={(e) => setProductToUpdate(productToUpdate && { ...productToUpdate, size: Number(e.target.value) })}
                                        required type="number" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5   dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
                                    <input
                                        style={{ background: loading ? "rgb(0,0,0,0.05)" : "", cursor: loading ? 'not-allowed' : 'default' }}
                                        defaultValue={productToUpdate?.stock}
                                        min={0}
                                        onChange={(e) => setProductToUpdate(productToUpdate && { ...productToUpdate, stock: Number(e.target.value) })}
                                        required type="number" aria-describedby="helper-text-explanation" className=" block w-22 p-2.5  bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300  dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                                    <Select
                                        disabled={loading}
                                        allowClear
                                        style={{ minWidth: '170px' }}
                                        size="large"
                                        defaultValue={productToUpdate?.gender}
                                        value={productToUpdate?.gender}
                                        onChange={(value) => setProductToUpdate(productToUpdate && { ...productToUpdate, gender: value })}
                                        options={genderOptions}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                <TextArea
                                    disabled={loading}
                                    value={productToUpdate?.description.toString()} defaultValue={productToUpdate?.description} onChange={(e) => {
                                        if (productToUpdate) setProductToUpdate({ ...productToUpdate, description: e.target.value })
                                    }} autoSize={{ minRows: 2, maxRows: 6 }} />
                            </div>
                            <FilesUpload onError={(err) => setStatus(err)} onSelectImageDeletion={(imgName) => setImagesToDelete([...imagesToDelete, imgName])} alreadyUploaded={productToUpdate?.images} onUpload={(images) => setImages(images)} />
                        </div>
                        <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button
                                onClick={() => productStore?.setOpenUpdateProductModal(false)}
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
                                    Save Updates
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
})

export default UpdateProduct;
