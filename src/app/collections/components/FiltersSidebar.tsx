'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function FiltersSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const updateQuery = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value || value === 'all') {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.push('?' + params.toString());
    };

    const clearFilters = () => {
        router.replace('/collections');
    };

    return (
        <div className="md:w-1/5 w-full space-y-6">
            <div className="border p-4 bg-white shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700">Filters</h3>
                    <button
                        onClick={clearFilters}
                        className="text-xs text-gray-500 hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        className="w-full border px-2 py-1 mt-1 text-sm"
                        value={searchParams.get('category') || 'all'}
                        onChange={(e) => updateQuery('category', e.target.value)}
                    >
                        <option value="all">All Jewelry</option>
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="bracelets">Bracelets</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Price Range</label>
                    <select
                        className="w-full border px-2 py-1 mt-1 text-sm"
                        value={searchParams.get('priceRange') || 'all'}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'all') {
                                updateQuery('minPrice', undefined);
                                updateQuery('maxPrice', undefined);
                            } else if (val === '0-100') {
                                updateQuery('minPrice', '0');
                                updateQuery('maxPrice', '100');
                            } else if (val === '100-500') {
                                updateQuery('minPrice', '100');
                                updateQuery('maxPrice', '500');
                            } else if (val === '500+') {
                                updateQuery('minPrice', '500');
                                updateQuery('maxPrice', undefined);
                            }
                            updateQuery('priceRange', val);
                        }}
                    >
                        <option value="all">All Prices</option>
                        <option value="0-100">$0 - $100</option>
                        <option value="100-500">$100 - $500</option>
                        <option value="500+">$500+</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Gender</label>
                    <select
                        className="w-full border px-2 py-1 mt-1 text-sm"
                        value={searchParams.get('gender') || 'all'}
                        onChange={(e) => updateQuery('gender', e.target.value)}
                    >
                        <option value="all"></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Material</label>
                    <div className="flex flex-col gap-1 mt-1 text-sm">
                        {['Gold', 'Silver', 'Platinum'].map((mat) => (
                            <label key={mat} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={searchParams.getAll('material').includes(mat)}
                                    onChange={(e) => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        const currentMaterials = params.getAll('material');

                                        if (e.target.checked) {
                                            params.append('material', mat);
                                        } else {
                                            params.delete('material');
                                            currentMaterials
                                                .filter((m) => m !== mat)
                                                .forEach((m) => params.append('material', m));
                                        }

                                        router.push('?' + params.toString());
                                    }}
                                />
                                {mat[0].toUpperCase() + mat.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
