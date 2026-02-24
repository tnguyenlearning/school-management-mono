import { Button, Form, Input, notification, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudentAccount } from '~/common/services/apis/studentAccountApis';
import { StudentAccountType } from '~/common/constants/app-enums';
import urls from '~/common/configs/urls';
import { useEffect } from 'react';

const StudentAccountForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { action, studentCode } = useParams();

    useEffect(() => {
        if (action === 'details' && studentCode) {
            navigate(`${urls.balanceDetails}/${studentCode}`);
        }
    }, [action, studentCode]);

    const handleSubmit = async () => {
        const values = await form.validateFields();

        console.log('Form Values:', values);
        const { errorMessage } = await createStudentAccount(values);

        if (errorMessage) {
            notification.error({
                message: 'Error Submitting Form',
                description: errorMessage,
            });
        } else {
            notification.success({
                message: 'Success',
                description: 'Student account created successfully.',
            });
            navigate(urls.studentAccountManagement);
        }
    };

    return (
        <Form form={form} layout="vertical" disabled={action === 'details'} onFinish={handleSubmit}>
            <Form.Item label="Student Code" name="studentCode" rules={[{ required: true, message: 'Student Code is required' }]}>
                <Input disabled={action === 'details'} />
            </Form.Item>

            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Type is required' }]}>
                <Select disabled={action === 'details'}>
                    {Object.keys(StudentAccountType).map((key) => (
                        <Select.Option key={key} value={StudentAccountType[key]}>
                            {StudentAccountType[key]}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {action !== 'details' && (
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={() => navigate(urls.studentAccountManagement)}>
                        Cancel
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};

export default StudentAccountForm;
