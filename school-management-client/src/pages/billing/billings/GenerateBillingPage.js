import { Button, DatePicker, Form, Input, Table, message, Card, Typography, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { generateBillingCycleForRange } from '~/common/services/apis/billingApis';
import FormItem from '~/components/FormItem';

const { Title } = Typography;

const GenerateBillingPage = () => {
    const [loading, setLoading] = useState(false);
    const [billingResults, setBillingResults] = useState([]);
    const [form] = Form.useForm();

    // Set effective date default to today
    useEffect(() => {
        form.setFieldsValue({ effDate: moment() });
    }, [form]);

    const handleGenerateBilling = async () => {
        try {
            const values = await form.validateFields();
            const { effDate, fromStudentCode, toStudentCode } = values;
            setLoading(true);
            const payload = {
                effDate: effDate.format('YYYY-MM-DD'),
                fromStudentCode: fromStudentCode ? fromStudentCode : '',
                toStudentCode: toStudentCode ? fromStudentCode : '',
            };
            const { response, errorMessage } = await generateBillingCycleForRange(payload);
            if (errorMessage) {
                message.error(errorMessage || 'Failed to generate billing cycle.');
            } else if (!response || response.length === 0) {
                message.info('No billing results found for the given criteria.');
                setBillingResults([]);
            } else {
                setBillingResults(response);
                message.success('Billing cycle generated successfully!');
            }
        } catch (error) {
            message.warning('Please fill out all fields.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'No.', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Student Code', dataIndex: 'studentCode', key: 'studentCode', width: 120 },
        { title: 'Name', dataIndex: 'name', key: 'name', width: 500 },
        { title: 'Course Code', dataIndex: 'courseCode', key: 'courseCode', width: 120 },
        { title: 'Cycle', dataIndex: 'cycleNum', key: 'cycleNum', width: 80 },
        { title: 'Frequency', dataIndex: 'frequency', key: 'frequency', width: 100 },
        { title: 'Start Date', dataIndex: 'cycleStartDate', key: 'cycleStartDate', width: 120 },
        { title: 'End Date', dataIndex: 'cycleEndDate', key: 'cycleEndDate', width: 120 },
        { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
        { title: 'Total Learning Days', dataIndex: 'totalLearningDays', key: 'totalLearningDays', width: 100 },
        { title: 'Amount Due', dataIndex: 'amountDue', key: 'amountDue', width: 140, render: (value) => value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
        { title: 'Amount Paid', dataIndex: 'amountPaid', key: 'amountPaid', width: 140, render: (value) => value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) },
        { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 120 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Generate Billing</Title>
            <Card style={{ marginBottom: '20px' }}>
                <Form layout="vertical" form={form}>
                    <Row justify="space-between" gutter={16}>
                        <FormItem label="Effective Date" name="effDate" rules={[{ required: true }]} element={<DatePicker />} />
                        <FormItem label="From Student Code" name="fromStudentCode" element={<Input placeholder="Enter From Student Code" />} />
                        <FormItem label="To Student Code" name="toStudentCode" element={<Input placeholder="Enter To Student Code" />} />
                    </Row>
                    <Form.Item>
                        <Button type="primary" onClick={handleGenerateBilling} loading={loading} disabled={loading}>
                            Generate Billing
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Title level={3}>Billing Results</Title>
            <Table
                dataSource={billingResults.map((item) => ({
                    ...item,
                    key: item.id,
                }))}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default GenerateBillingPage;
