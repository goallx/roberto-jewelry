'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function FiltersSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useTranslation();

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
                    <h3 className="font-semibold text-gray-700">{t('Filters.title')}</h3>
                    <button
                        onClick={clearFilters}
                        className="text-xs text-gray-500 hover:underline"
                    >
                        {t('Filters.clearAll')}
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Filters.category')}</label>
                    <select
                        className="w-full border px-2 py-1 mt-1 text-sm"
                        value={searchParams.get('category') || 'all'}
                        onChange={(e) => updateQuery('category', e.target.value)}
                    >
                        <option value="all">{t('Filters.allJewelry')}</option>
                        <option value="rings">{t('Navbar.Rings')}</option>
                        <option value="necklaces">{t('Navbar.Necklaces')}</option>
                        <option value="bracelets">{t('Navbar.Bracelets')}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Filters.priceRange')}</label>
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
                        <option value="all">{t('Filters.allPrices')}</option>
                        <option value="0-100">{t('Filters.priceRanges.0-100')}</option>
                        <option value="100-500">{t('Filters.priceRanges.100-500')}</option>
                        <option value="500+">{t('Filters.priceRanges.500+')}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Filters.gender')}</label>
                    <select
                        className="w-full border px-2 py-1 mt-1 text-sm"
                        value={searchParams.get('gender') || 'all'}
                        onChange={(e) => updateQuery('gender', e.target.value)}
                    >
                        <option value="all">{t('Filters.genders.all')}</option>
                        <option value="male">{t('Filters.genders.male')}</option>
                        <option value="female">{t('Filters.genders.female')}</option>
                        <option value="unisex">{t('Filters.genders.unisex')}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">{t('Filters.material')}</label>
                    <div className="flex flex-col gap-1 mt-1 text-sm">
                        {['gold', 'silver', 'platinum'].map((mat) => (
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
                                {/* {t(`Filters.materials.${mat}`)} */}
                                {mat}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}