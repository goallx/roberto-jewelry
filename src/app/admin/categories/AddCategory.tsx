'use client'

import FilesUpload from "@/components/files-upload/FilesUpload";
import { Loader } from "@/components/loader/Loader";
import { useAlert } from "@/context/AlertsContext";
import { useStores } from "@/context/StoreContext";
import { INewCategory } from "@/stores/CategoryStore";
import UploadsManager from "@/utils/UploadsManager";
import { useEffect, useRef, useState } from "react";

const AddCategory = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [status, setStatus] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [images, setImages] = useState<File[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { categoryStore } = useStores()
    const { showAlert } = useAlert()

    useEffect(() => {
        if (!name || !images.length) {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [name, images])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        if (!name || !images.length) {
            setStatus("Please fill in all fields and select one image.");
            return;
        }

        const uploadedImages = await UploadsManager.uploadImages(images)
        const newCategory: INewCategory = {
            name,
            images: uploadedImages
        }

        await categoryStore?.addCategory(newCategory, () => {
            onClose()
            showAlert(`${newCategory.name} added successfuly!`, 'success')
            return
        }, (err) => {
            setStatus(err ?? "Something went wrong")
            showAlert(`Failed to add ${newCategory.name}`, 'error')
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
                            Add Category
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
                            <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                            <input defaultValue={name} onChange={(e) => setName(e.target.value)} required type="text" aria-describedby="helper-text-explanation" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5   dark:placeholder-gray-400 dark:text-black dark:focus:ring-gray-300" />
                            <FilesUpload onError={(err) => setStatus(err)} onUpload={(images) => setImages(images)} />
                            <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Make sure that the category name is unique</p>
                        </div>
                        <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button
                                onClick={onClose}
                                data-modal-hide="default-modal"
                                type="button"
                                className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:text-black hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDisabled}
                                data-modal-hide="default-modal"
                                type="submit"
                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none rounded-lg border border-gray-200  focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            >
                                {
                                    loading ?
                                        <Loader />
                                        :
                                        <>
                                            Save Category
                                        </>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
