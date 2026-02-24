import { Button, Card, DatePicker, Form, Input, message, Row, Table } from 'antd';
import Title from 'antd/es/skeleton/Title';
import { useState } from 'react';
import { collectionForRange } from '~/common/services/apis/billingApis';
import FormItem from '~/components/FormItem';

const CollectionPage = () => {
    const [loading, setLoading] = useState(false);
    const [collectionResults, setCollectionResults] = useState([]);
    const [form] = Form.useForm();

    const handleCollection = async () => {
        try {
            const values = await form.validateFields();
            const { effDate, fromStudentCode, toStudentCode } = values;
            setLoading(true);
            const payload = {
                effDate: effDate.format('YYYY-MM-DD'),
                fromStudentCode: fromStudentCode ? fromStudentCode : '',
                toStudentCode: toStudentCode ? fromStudentCode : '',
            };
            const { response, errorMessage } = await collectionForRange(payload);
            if (errorMessage) {
                message.error(errorMessage || 'Failed to collection.');
            } else if (!response || response.length === 0) {
                message.info('No collection results found for the given criteria.');
                setCollectionResults([]);
            } else {
                setCollectionResults(response);
                message.success('Collection successfully!');
            }
        } catch (error) {
            message.warning('Please fill out all fields.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Course Code', dataIndex: 'courseCode', key: 'courseCode' },
        { title: 'Student Code', dataIndex: 'studentCode', key: 'studentCode' },
        { title: 'Cycle Num', dataIndex: 'cycleNum', key: 'cycleNum' },
        { title: 'Cycle Start Date', dataIndex: 'cycleStartDate', key: 'cycleStartDate' },
        { title: 'Cycle End Date', dataIndex: 'cycleEndDate', key: 'cycleEndDate' },
        {
            title: 'Payments',
            dataIndex: 'payments',
            key: 'payments',
            render: (payments) =>
                payments.map((payment) => (
                    <div key={payment.id}>
                        <div>Payment ID: {payment.id}</div>
                        <div>Payment Date: {payment.paymentDate}</div>
                        <div>Amount: ${payment.amount.toFixed(2)}</div>
                    </div>
                )),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Collect Invoice Payments</Title>
            <Card style={{ marginBottom: '20px' }}>
                <Form layout="vertical" form={form}>
                    <Row justify="space-between" gutter={16}>
                        <FormItem label="Effective Date" name="effDate" rules={[{ required: true }]} element={<DatePicker />} />
                        <FormItem label="From Student Code" name="fromStudentCode" element={<Input placeholder="Enter From Student Code" />} />
                        <FormItem label="To Student Code" name="toStudentCode" element={<Input placeholder="Enter To Student Code" />} />
                    </Row>
                    <Form.Item>
                        <Button type="primary" onClick={handleCollection} loading={loading} disabled={loading}>
                            Collect Payments
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Title level={3}>Payment Collection Results</Title>
            <Table
                dataSource={collectionResults.map((item) => ({
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

export default CollectionPage;
