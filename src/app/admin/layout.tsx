import { AdminSidebar } from "@/components/admin-sidebar/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-4 min-h-screen bg-[rgba(242, 239, 237, 1)]">
                {children}
            </main>
        </div>
    );
}
