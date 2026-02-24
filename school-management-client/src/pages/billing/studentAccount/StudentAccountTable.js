import React from 'react';
import { Table, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import urls from '~/common/configs/urls';

const StudentAccountTable = ({ data, loading }) => {
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Student Code',
            dataIndex: 'studentCode',
            key: 'studentCode',
            sorter: (a, b) => a.studentCode.localeCompare(b.studentCode),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Regular', value: 'REGULAR' },
                { text: 'Special', value: 'SPECIAL' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Balance Amount',
            dataIndex: 'balanceAmount',
            key: 'balanceAmount',
            sorter: (a, b) => a.balanceAmount - b.balanceAmount,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => navigate(`${urls.baseBalanceDetails}/${record.studentCode}`)}>Details</Button>
                    <Button onClick={() => navigate(`${urls.baseReceiptForm}/create/${record.studentCode}`)}>Create Receipt</Button>
                </Space>
            ),
        },
    ];

    return <Table rowKey="id" columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 10 }} />;
};

export default StudentAccountTable;
