import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '~/redux/actions/authActions';
import urls from '~/common/configs/urls';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (loginData) => {
        setError('');
        try {
            await dispatch(login(loginData));
            navigate(urls.home);
        } catch (error) {
            if (error.message.includes('Network error')) {
                navigate(urls.networkErr);
            } else {
                setError(error.data.error_message);
            }
        }
    };

    return (
        <div>
            <Form name="login" initialValues={{ remember: true }} style={{ maxWidth: 360 }} onFinish={handleLogin}>
                <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]} initialValue={formData.email}>
                    <Input prefix={<UserOutlined />} placeholder="Email..." />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]} initialValue={formData.password}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Password..." />
                </Form.Item>
                <Form.Item>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
