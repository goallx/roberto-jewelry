'use client'
import SpecialOrdersTable from "@/components/table/SpecialOrdersTable"

const Orders = () => {
    return (
        <div className="h-full overflow-y-auto flex flex-col gap-5">
            <h1 className="text-2xl font-medium">Special Orders</h1>
            <div className="container px-6 py-6 bg-white h-full rounded-2xl">
                <div className="flex flex-col gap-6 w-full">
                    <SpecialOrdersTable />
                </div>
            </div>
        </div>
    )
}

export default Orders