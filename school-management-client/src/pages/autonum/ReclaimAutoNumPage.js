import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { reclaimAutoNum } from '~/common/services/apis/autonumApis';
import { AnumType } from '~/common/constants/app-enums';
import FormItem from '~/components/FormItem';

const { Option } = Select;

const ReclaimAutoNumPage = () => {
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        const { type, prefix, number } = values;
        setLoading(true);
        const { response, errorMessage } = await reclaimAutoNum(type, number, prefix);
        if (errorMessage) {
            message.error(errorMessage || 'Failed to reclaim the number.');
        } else {
            message.success('Number reclaimed successfully!');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Reclaim Auto Number</h2>
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

                {/* Number Field */}
                <Form.Item name="number" label="Number to Reclaim" rules={[{ required: true, message: 'Please enter a number to reclaim!' }]}>
                    <Input placeholder="Enter number to reclaim (e.g., 20230001)" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Reclaim Number
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ReclaimAutoNumPage;
