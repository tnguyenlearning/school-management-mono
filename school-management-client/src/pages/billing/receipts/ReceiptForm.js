import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Spin, message } from 'antd';
import { PAYMENT_METHODS } from '~/common/constants/app-enums';
import { fetchReceiptDetails, createReceipt, updateReceipt } from '~/common/services/apis/receiptApi';
import { useParams, useNavigate } from 'react-router-dom';
import urls from '~/common/configs/urls';

const { Option } = Select;

const ReceiptForm = ({ match }) => {
    const { action, studentCode, studentAccountId } = useParams(); // Retrieve session ID and course ID from URL

    const [receipt, setReceipt] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigation hook

    console.log('studentAccountId', studentAccountId);

    useEffect(() => {
        if (action === 'enquiry' || action === 'update') {
            if (!studentCode || !studentAccountId) {
                message.error('Student Code or Student Account ID is missing.');
                return;
            }
            setLoading(true);
            fetchReceiptDetails(match.params.id_or_code).then((data) => {
                setReceipt(data);
                setLoading(false);
            });
        } else if (action === 'create') {
            setReceipt((prev) => ({ ...prev, studentCode })); // Auto-fill studentCode
        }
    }, [action, studentCode, studentAccountId]);

    const handleSubmit = async (values) => {
        const code = values.studentCode || studentCode;
        if (action === 'create') {
            const { response, errorMessage } = await createReceipt(code, values);
            console.log('Receipt creation response:', response, 'Error message:', errorMessage);
            if (errorMessage) {
                message.error(errorMessage);
            } else {
                message.success('Receipt created successfully!');
                navigate(`${urls.baseBalanceDetails}/${code}`);
            }
        } else if (action === 'update') {
            const { response, errorMessage } = await updateReceipt(code, values);
            console.log('Receipt update response:', response, 'Error message:', errorMessage);
            if (errorMessage) {
                message.error(errorMessage);
            } else {
                message.success('Receipt updated successfully!');
                navigate(`${urls.baseBalanceDetails}/${code}`);
            }
        }
    };

    if (loading) return <Spin />;

    return (
        <Form initialValues={{ ...receipt, studentCode }} onFinish={handleSubmit} layout="vertical" disabled={action === 'enquiry'}>
            <Form.Item label="Student Code" name="studentCode" rules={[{ required: true }]}>
                <Input disabled={action === 'enquiry' || action === 'update'} />
            </Form.Item>
            <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
                <Input type="number" disabled={action === 'enquiry'} />
            </Form.Item>
            <Form.Item label="Remarks" name="remarks">
                <Input disabled={action === 'enquiry'} />
            </Form.Item>
            <Form.Item label="Receipt Date" name="receiptDate" rules={[{ required: true }]}>
                <DatePicker disabled={action === 'enquiry'} />
            </Form.Item>
            <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
                <Select disabled={action === 'enquiry'}>
                    {Object.keys(PAYMENT_METHODS).map((key) => (
                        <Option key={key} value={key}>
                            {PAYMENT_METHODS[key]}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            {action === 'create' && (
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            )}
            {action === 'update' && (
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};

export default ReceiptForm;
