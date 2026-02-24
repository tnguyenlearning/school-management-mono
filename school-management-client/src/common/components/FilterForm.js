import React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;

const FilterForm = ({ filters, onSubmit, extraFields }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            dateRange: values.dateRange ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')] : undefined,
        };
        onSubmit(formattedValues);
    };

    return (
        <Form form={form} layout="inline" onFinish={handleFinish} initialValues={filters}>
            {extraFields}
            <Form.Item name="dateRange" label="Date Range">
                <RangePicker />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FilterForm;
