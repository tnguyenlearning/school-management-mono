import React, { useState, useEffect } from 'react';
import { Card, Table, message, Pagination, Form, Input, Select, DatePicker, Button } from 'antd';
import { getInvoices } from '~/common/services/apis/invoiceApis';
import moment from 'moment';
import { InvoiceStatus, InvoiceType } from '~/common/constants/app-enums'; // Import enums

const { Option } = Select;

const InvoicesEnquiryPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({});

    const fetchInvoices = async (page = 0, pageSize, appliedFilters = filters) => {
        try {
            const { response, errorMessage } = await getInvoices({ ...appliedFilters, page, size: pageSize });
            console.log('Invoices response:', response, errorMessage);
            if (errorMessage) {
                message.error(errorMessage);
            } else {
                setInvoices(response.content);
                setPagination({ ...pagination, total: response.pageable.totalElements, current: page + 1 }); // Adjust current page for UI
            }
        } catch (error) {
            message.error('Failed to fetch invoices. Please try again.');
        }
    };

    useEffect(() => {
        fetchInvoices(pagination.current - 1, pagination.pageSize);
    }, [filters]);

    const handlePageChange = (page, pageSize) => {
        fetchInvoices(page - 1, pageSize); // Subtract 1 to start from 0
    };

    const handleFilterSubmit = (values) => {
        const formattedValues = {
            ...values,
            issueDate: values.issueDate ? moment(values.issueDate).format('YYYY-MM-DD') : undefined,
            publicDate: values.publicDate ? moment(values.publicDate).format('YYYY-MM-DD') : undefined,
        };
        setFilters(formattedValues);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Course Code', dataIndex: 'courseCode', key: 'courseCode' },
        { title: 'Student Code', dataIndex: 'studentCode', key: 'studentCode' },
        { title: 'Amount Due', dataIndex: 'amountDue', key: 'amountDue' },
        { title: 'Amount Paid', dataIndex: 'amountPaid', key: 'amountPaid' },
        {
            title: 'Issue Date',
            dataIndex: 'issueDate',
            key: 'issueDate',
            render: (date) => (date ? moment(date).format('YYYY-MM-DD') : ''),
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => (date ? moment(date).format('YYYY-MM-DD') : ''),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => InvoiceStatus[status] || status,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => InvoiceType[type] || type,
        },
        { title: 'Description', dataIndex: 'description', key: 'description' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Invoices Enquiry</h1>
            <Card bordered={false}>
                <p>Here you can enquire detailed invoice information for students.</p>
                <Form layout="inline" onFinish={handleFilterSubmit} style={{ marginBottom: '20px' }}>
                    <Form.Item name="studentCode" label="Student Code">
                        <Input placeholder="Enter Student Code" />
                    </Form.Item>
                    <Form.Item name="courseCode" label="Course Code">
                        <Input placeholder="Enter Course Code" />
                    </Form.Item>
                    <Form.Item name="billingCycleId" label="Billing Cycle">
                        <Input placeholder="Enter Billing Cycle ID" />
                    </Form.Item>
                    <Form.Item name="issueDate" label="Issue Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="publicDate" label="Public Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select placeholder="Select Status">
                            {Object.keys(InvoiceStatus).map((key) => (
                                <Option key={key} value={InvoiceStatus[key]}>
                                    {InvoiceStatus[key]}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="type" label="Type">
                        <Select placeholder="Select Type">
                            {Object.keys(InvoiceType).map((key) => (
                                <Option key={key} value={InvoiceType[key]}>
                                    {InvoiceType[key]}
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
                <Table columns={columns} dataSource={invoices} pagination={false} rowKey="id" />
                <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} style={{ marginTop: '20px' }} />
            </Card>
        </div>
    );
};

export default InvoicesEnquiryPage;
