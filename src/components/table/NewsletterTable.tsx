import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { NewsLetterSubscription } from '@/models/Newsletter';
import { formatDate } from '@/utils/helpers';

interface DataType {
    key: React.Key;
    email: string;
    joinDate: number;
    type: boolean;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Join date',
        dataIndex: 'joinDate',
    },
    {
        title: 'Subscriber type',
        dataIndex: 'type',
        render: (status: boolean) => (status ? 'Customer' : '-'),
    },
];

const NewsletterTable: React.FC = () => {
    const [subscribers, setSubscribers] = useState<DataType[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/newsletter', { method: 'GET', credentials: 'include' });
                const data = await response.json();
                if (response.ok) {
                    const { subscribers } = data;
                    const transformedSubscribers = subscribers.map((sub: NewsLetterSubscription & { hasProfile: boolean }, index: number) => ({
                        key: index,
                        email: sub.email,
                        joinDate: formatDate(sub.createdAt.toString()),
                        type: !!sub.hasProfile,
                    }));
                    setSubscribers(transformedSubscribers);
                } else {
                    setError('Failed to fetch subscribers.');
                }
            } catch (err: any) {
                setError(err.message || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle row selection
    const rowSelection: TableProps<DataType>['rowSelection'] = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            const emails = selectedRows.map((row) => row.email);
            setSelectedEmails(emails);
        },
    };


    const handleSendEmails = () => {
        if (selectedEmails.length === 0) {
            alert("Please select at least one subscriber.");
            return;
        }

        const emailList = selectedEmails.join(',');
        const mailtoLink = `mailto:${emailList}`;

        window.open(mailtoLink, '_self');
    };

    return (
        <div className="flex flex-col gap-5">
            {error && <p className="text-red-500">{error}</p>}
            <div className="w-full flex justify-end">
                <Button onClick={handleSendEmails} disabled={selectedEmails.length === 0}>
                    Send email
                </Button>
            </div>
            <Table<DataType>
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={columns}
                dataSource={subscribers}
                loading={isLoading}
            />
        </div>
    );
};

export default NewsletterTable;
