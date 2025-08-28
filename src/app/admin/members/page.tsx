import { MembersTable } from "@/components/table/MembersTable";

const Members = () => {

    return (
        <div className="h-full flex flex-col gap-5">
            <h1 className="text-2xl font-medium">Members</h1>
            <div className="container px-6 py-6 bg-white h-full rounded-2xl">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">Latest Orders</p>
                    </div>
                    <MembersTable />
                </div>
            </div>
        </div>
    )
}

export default Members