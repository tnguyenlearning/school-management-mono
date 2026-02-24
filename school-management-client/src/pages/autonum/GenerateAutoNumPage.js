import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Button, message } from 'antd';
import { generateAutoNum } from '~/common/services/apis/autonumApis';
import { AnumType } from '~/common/constants/app-enums';
import FormItem from '~/components/FormItem';

const { Option } = Select;

const GenerateAutoNumPage = () => {
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        const { type, prefix, count } = values;
        setLoading(true);
        const { response, errorMessage } = await generateAutoNum(type, prefix, count);
        if (errorMessage) {
            message.error(errorMessage || 'Failed to generate numbers.');
        } else {
            message.success('Numbers generated successfully!');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Generate Auto Numbers</h2>
            <Form
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{
                    type: 'STUDENT',
                }}
            >
                <FormItem
                    label="Type"
                    name="type"
                    rules={[{ required: true }]}
                    element={
                        <Select placeholder="Select a type">
                            {Object.entries(AnumType).map(([key, value]) => (
                                <Option key={key} value={key}>
                                    {value}
                                </Option>
                            ))}
                        </Select>
                    }
                />

                {/* Prefix Field */}
                <Form.Item
                    name="prefix"
                    label="Prefix"
                    rules={[
                        { required: true, message: 'Please enter a prefix!' },
                        { max: 10, message: 'Prefix cannot exceed 10 characters!' },
                    ]}
                >
                    <Input placeholder="Enter prefix (e.g., EN)" />
                </Form.Item>

                {/* Count Field */}
                <Form.Item
                    name="count"
                    label="Number of Numbers"
                    rules={[
                        { required: true, message: 'Please enter the count!' },
                        { type: 'number', min: 1, message: 'Count must be at least 1!' },
                    ]}
                >
                    <InputNumber placeholder="Enter count" style={{ width: '100%' }} />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Generate Numbers
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default GenerateAutoNumPage;
