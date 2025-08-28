'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SizeChart() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const handleEscape = (e: any) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    return (
        <div>
            <button
                onClick={openModal}
                className="text-black px-4 py-2 w-full rounded-md bg-gray-200 hover:bg-black hover:text-white transition-colors mt-2"
                aria-label="Open size chart"
            >
                Size Chart
            </button>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={closeModal}
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button (X Icon) */}
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-black transition-colors"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h2 className="font-amandine text-xl font-bold mb-4">Size Chart</h2>
                            <div className="relative w-full h-96">
                                <Image
                                    src="https://firebasestorage.googleapis.com/v0/b/roberto-jewerly.firebasestorage.app/o/app-images%2Fchart-size.jpg?alt=media&token=ff11bc52-513f-418c-b9af-713f2e3e934a"
                                    alt="Size chart"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="p-2 rounded-lg">
                                <p className="text-center font-bold mb-4">Pendant Size & Necklace Length Chart – Roberto Jewelry</p>
                                <label className="font-semibold">Helpful Tips</label>
                                <ul className="list-disc pl-5 mt-2 space-y-2">
                                    <li>For larger frames: Avoid chains that are too short, as they may make the neck appear bulkier.</li>
                                    <li>For smaller frames: A chain that fits too tightly can minimize your features, while one that’s too long may create a disproportionate look.</li>
                                    <li>For balanced aesthetics: Select a length that complements both your build and your wardrobe style.</li>
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}