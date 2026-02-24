import React from 'react';
import { Table, Button } from 'antd';
import { PAYMENT_METHODS } from '~/common/constants/app-enums';

const ReceiptTable = ({ data, loading }) => {
    const columns = [
        {
            title: 'Receipt ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Student Code',
            dataIndex: 'studentCode',
            key: 'studentCode',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Receipt Date',
            dataIndex: 'receiptDate',
            key: 'receiptDate',
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method) => PAYMENT_METHODS[method],
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => null, // Removed "Enquiry" button
        },
    ];

    return <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />;
};

export default ReceiptTable;
