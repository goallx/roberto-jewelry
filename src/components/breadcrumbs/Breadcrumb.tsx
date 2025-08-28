'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BreadCrumb.module.css';

export const Breadcrumb = () => {
    const pathname = usePathname();

    if (!pathname) {
        return null;
    }

    const pathnames = pathname.split('/').filter((x) => x);

    return (
        <nav aria-label="breadcrumb">
            <div className={styles.breadcrumb}>
                <li><Link href="/">Home</Link></li>
                {pathnames.map((value: string, index: number) => {
                    value = decodeURIComponent(value)
                    if (value !== "products") {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                        return (
                            <li key={to}>
                                <Link href={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
                            </li>
                        );
                    }
                })}
            </div>
        </nav>
    );
};


