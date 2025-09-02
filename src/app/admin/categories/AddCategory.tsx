'use client';

import { useState, useEffect, FormEvent } from 'react';
import FilesUpload from '@/components/files-upload/FilesUpload';
import { Loader } from '@/components/loader/Loader';
import { useAlert } from '@/context/AlertsContext';
import { useStores } from '@/context/StoreContext';
import { INewCategory } from '@/stores/CategoryStore';
import UploadsManager from '@/utils/UploadsManager';

interface AddCategoryProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddCategory({ visible, onClose }: AddCategoryProps) {
    const { categoryStore } = useStores();
    const { showAlert } = useAlert();

    const [name, setName] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isDisabled = !name.trim() || images.length === 0 || loading;

    useEffect(() => {
        if (!visible) {
            setName('');
            setImages([]);
            setError('');
            setLoading(false);
        }
    }, [visible]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isDisabled) return;

        try {
            setLoading(true);
            setError('');

            const uploadedImages = await UploadsManager.uploadImages(images);
            const newCategory: INewCategory = {
                name: name.trim(),
                images: uploadedImages,
            };

            await categoryStore?.addCategory(
                newCategory,
                () => {
                    showAlert(`${newCategory.name} added successfully!`, 'success');
                    onClose();
                },
                (err) => {
                    const errorMsg = err ?? 'Something went wrong';
                    setError(errorMsg);
                    showAlert(`Failed to add ${newCategory.name}`, 'error');
                }
            );
        } catch (err: any) {
            setError(err.message || 'Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            <div className="relative w-full max-w-2xl p-4">
                <div className="relative bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-xl font-semibold text-gray-900">Add Category</h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="w-8 h-8 text-gray-400 rounded-lg hover:bg-gray-200"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-4 space-y-4">
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-gray-300 focus:ring-gray-300"
                                    placeholder="Enter category name"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Make sure the category name is unique.
                                </p>
                            </div>

                            <div>
                                <FilesUpload
                                    onUpload={(files) => setImages(files)}
                                    onError={(err) => setError(err)}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isDisabled}
                                className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg ${isDisabled
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-gray-900'
                                    }`}
                            >
                                {loading ? <Loader /> : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
