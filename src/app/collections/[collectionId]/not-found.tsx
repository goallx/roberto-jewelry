"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">
                Oops! The page you’re looking for does not exist.
            </p>
            <Link
                href="/collections"
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
                Go to collections
            </Link>
        </div>
    );
}
