import { Col, Form } from 'antd';
import React from 'react';

function FormItem({ span = 12, label, name, rules = [], element, disabled, defaultValue }) {
    return (
        <Col span={span}>
            <Form.Item label={label} name={name} rules={rules.map((rule) => ({ ...rule, message: `${label} is required` }))}>
                {React.cloneElement(element, { disabled, defaultValue })}
            </Form.Item>
        </Col>
    );
}

export default FormItem;
