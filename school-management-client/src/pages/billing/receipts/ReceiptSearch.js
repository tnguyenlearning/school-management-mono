import React from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import { PAYMENT_METHODS } from '~/common/constants/app-enums';

const { Option } = Select;

const ReceiptSearchForm = ({ onSearch }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        onSearch(values);
    };

    return (
        <Form form={form} onFinish={handleSubmit} layout="inline">
            <Form.Item name="studentAccount" label="Student Account">
                <Input placeholder="Student Account" />
            </Form.Item>
            <Form.Item name="receiptDate" label="Receipt Date">
                <DatePicker />
            </Form.Item>
            <Form.Item name="paymentMethod" label="Payment Method">
                <Select placeholder="Select Payment Method" allowClear>
                    {Object.keys(PAYMENT_METHODS).map((key) => (
                        <Option key={key} value={key}>
                            {PAYMENT_METHODS[key]}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ReceiptSearchForm;
