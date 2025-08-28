'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faSuitcase, faHouse, faLayerGroup, faUsers, faNewspaper, faFingerprint } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export const AdminSidebar = () => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    return (
        <div className="flex-[0.2]">
            <aside
                id="default-sidebar"
                // className="fixed top-0 left-0 z-40 w-full h-screen transition-transform -translate-x-full sm:translate-x-0"
                className="z-40 w-full h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-white">
                    <Link href={"/"} className="flex gap-1 my-5">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-1.png?alt=media&token=cacc86a9-43aa-4090-99da-9ed54525ee2d"
                            alt="Roberto Jewelry Logo"
                            width={150}
                            height={60}
                            priority
                        />
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-2.png?alt=media&token=0983bebe-a48b-4a69-9583-01bb56d4f325"
                            alt="Roberto Jewelry Logo"
                            width={70}
                            height={30}
                            priority
                            style={{ height: 20, alignSelf: 'flex-end', padding: 0, margin: 0 }}
                        />
                    </Link>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link
                                href="/"
                                className={`flex items-center p-2 rounded-lg ${isActive("/") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faHouse} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                            </Link>
                        </li>
                        <div className="bg-gray-200" style={{ height: 0.5 }} />
                        <li>
                            <Link
                                href="/admin/orders"
                                className={`flex items-center p-2 rounded-lg ${isActive("/admin/orders") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faLayerGroup} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Orders</span>
                            </Link>
                        </li>
                        <div className="bg-gray-200" style={{ height: 0.5 }} />
                        <li>
                            <Link
                                href="/admin/categories"
                                className={`flex items-center p-2 rounded-lg ${isActive("/admin/categories") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faBookOpen} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Categories</span>
                            </Link>
                        </li>
                        <div className="bg-gray-200" style={{ height: 0.5 }} />
                        <li>
                            <Link
                                href="/admin/products"
                                className={`flex items-center p-2 rounded-lg ${isActive("/admin/products") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faSuitcase} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                            </Link>
                        </li>
                        <div className="bg-gray-200" style={{ height: 0.5 }} />
                        <li>
                            <Link
                                href="/admin/members"
                                className={`flex items-center p-2 rounded-lg ${isActive("/admin/members") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faUsers} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Members</span>
                            </Link>
                        </li>
                        <div className="bg-gray-200" style={{ height: 0.5 }} />
                        <li>
                            <Link
                                href="/admin/newsletter"
                                className={`flex items-center p-2 rounded-lg ${isActive("/admin/newsletter") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faNewspaper} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Newsletter</span>
                            </Link>
                        </li>
                        <div className="bg-gray-200" style={{ height: 0.5 }} />
                        <li>
                            <Link
                                href="/admin/special-orders"
                                className={`flex items-center p-2 rounded-lg ${isActive("/admin/special-orders") ? "bg-gray-300 text-gray-800" : "text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon className="w-5 h-5" icon={faFingerprint} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Special orders</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};
