import React from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { StudentAccountType } from '../../../common/constants/app-enums';

const { Option } = Select;

const StudentAccountSearch = ({ onSearch }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSearch(values);
    };

    return (
        <Form form={form} layout="inline" onFinish={handleFinish}>
            <Form.Item name="studentCode" label="Student Code">
                <Input placeholder="Enter student code" />
            </Form.Item>
            <Form.Item name="type" label="Type">
                <Select placeholder="Select type" allowClear>
                    {Object.entries(StudentAccountType).map(([key, value]) => (
                        <Option key={key} value={value}>
                            {value}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="firstName" label="First Name">
                <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name">
                <Input placeholder="Enter last name" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
                <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button onClick={() => form.resetFields()}>Reset</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default StudentAccountSearch;
