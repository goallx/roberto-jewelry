'use client'

import { useEffect, useState } from 'react';
import { Loader } from '../loader/Loader'
import { IProfile } from '@/stores/ProfileStore';
import { formatDate } from '@/utils/helpers';

export interface IMember extends IProfile {
    totalSpent: number
}


export const MembersTable: React.FC = () => {
    const [members, setMembers] = useState<Array<IMember>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch('/api/membership', { method: "GET", credentials: 'include' })
            const data = await response.json()
            if (response.ok) {
                const membersWithTotal = data.data
                setMembers(membersWithTotal)
                return
            }
            setMembers([])
        }
        fetchMembers().finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-black uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-5">
                            Member ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Orders
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total Spent
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Join Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Member Kind
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={8} className="text-center py-6">
                                <div className="text-center flex justify-center">
                                    <div role="status">
                                        <Loader />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        members.map((member: IMember, index: number) => (
                            <MemberRow key={index} member={member} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

}

const MemberRow: React.FC<{ member: IMember }> = ({ member }) => {
    console.log('@@member', member)
    const memberType: string = member.membership?.memberKind ?? '-'
    return (
        <>
            <tr className="bg-white font-light border-b text-black dark:border-gray-700 hover:bg-gray-100">
                <td className="px-6 py-4">#{member._id}</td>
                <td className="px-6 py-4 relative flex justify-start gap-5 items-center">
                    {`${member.firstName} ${member.lastName ?? ""}`}
                </td>
                <td className="px-6 py-4">{member.numOfOrders}</td>
                <td className="px-6 py-4">
                    {member.totalSpent.toLocaleString('en-US')}
                </td>
                <td className="px-6 py-4">{formatDate(member.createdAt)}</td>
                <td className="px-6 py-4 font-medium">{memberType}</td>
            </tr>
        </>
    );
}



