import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, message, Spin, Card, notification, Select } from 'antd';
import { getFrequencyOptionById, createFrequencyOption, updateFrequencyOption } from '~/common/services/apis/frequencyApis';
import urls from '~/common/configs/urls';
import { FREQUENCIES } from '~/common/constants/Frequency';

const { Option } = Select;

const FrequencyOptForm = () => {
    const { action, id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [frequencyOption, setFrequencyOption] = useState(null);
    const [isLearningPeriod, setIsLearningPeriod] = useState(false);

    useEffect(() => {
        if (action !== 'create' && id) {
            fetchFrequencyOption(id);
        }
    }, [action, id]);

    const fetchFrequencyOption = async (id) => {
        setLoading(true);
        const { response, errorMessage } = await getFrequencyOptionById(id);
        setLoading(false);
        if (response) {
            setFrequencyOption(response);
            form.setFieldsValue(response);
        } else {
            message.error(errorMessage || 'Failed to load frequency option.');
        }
    };

    const handleValuesChange = (changedValues) => {
        if (changedValues.frequency !== undefined) {
            setIsLearningPeriod(changedValues.frequency === 'LEARNING_PERIOD');
        }
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        setLoading(true);
        const { response, errorMessage } = await (action === 'create' ? createFrequencyOption(values) : updateFrequencyOption(id, values));
        setLoading(false);
        if (response) {
            message.success(`${action === 'create' ? 'Created' : 'Updated'} successfully.`);
            navigate(urls.frequencyOptions);
        } else {
            message.error(errorMessage || 'Action failed.');
        }
    };

    const showErrorNotification = (message, description) => {
        notification.error({
            message,
            description,
        });
    };

    const renderFormItems = () => (
        <>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input disabled={action === 'view' || action === 'inquiry'} />
            </Form.Item>
            <Form.Item label="Frequency" name="frequency" rules={[{ required: true }]}>
                <Select placeholder="Select frequency" style={{ width: '100%' }} disabled={action === 'view' || action === 'inquiry'}>
                    {FREQUENCIES.map((freq) => (
                        <Option key={freq} value={freq}>
                            {freq}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Total Learning Days"
                name="totalLearningDays"
                rules={[
                    {
                        required: isLearningPeriod,
                        message: 'Total Learning Days is required when frequency is LEARNING_PERIOD.',
                    },
                ]}
            >
                <Input type="number" disabled={action === 'view' || action === 'inquiry' || !isLearningPeriod} />
            </Form.Item>
            <Form.Item label="Fee Amount" name="feeAmount" rules={[{ required: true }]}>
                <Input type="number" disabled={action === 'view' || action === 'inquiry'} />
            </Form.Item>
            <Form.Item label="Is Active" name="isActive" valuePropName="checked">
                <Input type="checkbox" disabled={action === 'view' || action === 'inquiry'} />
            </Form.Item>
        </>
    );

    return (
        <div style={{ padding: '20px' }}>
            <Card>
                <h1>{action === 'create' ? 'Create Frequency Option' : action === 'edit' ? 'Edit Frequency Option' : action === 'inquiry' ? 'Inquiry Frequency Option' : 'View Frequency Option'}</h1>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Form form={form} onFinish={handleSubmit} layout="vertical" onValuesChange={handleValuesChange}>
                        {renderFormItems()}
                        {action !== 'view' && action !== 'inquiry' && (
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {action === 'create' ? 'Create' : 'Update'}
                                </Button>
                            </Form.Item>
                        )}
                        <Button onClick={() => navigate(urls.frequencyOptions)}>Back to List</Button>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default FrequencyOptForm;
