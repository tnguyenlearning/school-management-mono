import React from 'react';
import { Table, Pagination, Form, Select, DatePicker, Button } from 'antd';
import useFetchData from '~/common/hooks/useFetchData';
import { PAYMENT_METHODS } from '~/common/constants/app-enums';

const { Option } = Select;

const ReceiptTab = ({ studentCode }) => {
    const { data, pagination, handlePageChange, handleFilterSubmit } = useFetchData({
        fetchFunction: 'searchReceipts',
        additionalParams: { studentCode },
    });

    const columns = [
        { title: 'Receipt ID', dataIndex: 'id', key: 'id' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
        { title: 'Date', dataIndex: 'receiptDate', key: 'receiptDate' },
    ];

    return (
        <div>
            <Form layout="inline" onFinish={handleFilterSubmit} style={{ marginBottom: '20px' }}>
                <Form.Item name="dateRange" label="Date Range">
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item name="paymentMethod" label="Payment Method">
                    <Select placeholder="Select Payment Method" style={{ width: 150 }}>
                        {Object.keys(PAYMENT_METHODS).map((key) => (
                            <Option key={key} value={key}>
                                {PAYMENT_METHODS[key]}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Filter
                    </Button>
                </Form.Item>
            </Form>
            <Table columns={columns} dataSource={data} pagination={false} rowKey="id" />
            <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} style={{ marginTop: '20px' }} />
        </div>
    );
};

export default ReceiptTab;
