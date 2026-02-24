import React from 'react';
import { Table, Pagination, Form, DatePicker, Button } from 'antd';
import useFetchData from '~/common/hooks/useFetchData';

const PaymentTab = ({ studentCode }) => {
    const { data, pagination, handlePageChange, handleFilterSubmit } = useFetchData({
        fetchFunction: 'searchPayments',
        additionalParams: { studentCode },
    });

    const columns = [
        { title: 'Payment ID', dataIndex: 'id', key: 'id' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Date', dataIndex: 'paymentDate', key: 'paymentDate' },
    ];

    return (
        <div>
            <Form layout="inline" onFinish={handleFilterSubmit} style={{ marginBottom: '20px' }}>
                <Form.Item name="dateRange" label="Date Range">
                    <DatePicker.RangePicker />
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

export default PaymentTab;
