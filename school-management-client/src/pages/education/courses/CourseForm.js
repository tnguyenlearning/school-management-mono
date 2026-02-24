import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spin, Typography, Card, Row, Col } from 'antd';
import useCourseForm from './hooks/useCourseForm';
import CourseFormFields from './CourseFormFields';

const { Title } = Typography;

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const CourseForm = () => {
    const { action, courseId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { course, frequencyOptions, selectedOptions, setSelectedOptions, loading, disabled, handleSubmit, handleCancel } = useCourseForm(action, courseId, form);

    return (
        <div>
            {console.log('disableddisableddisableddisableddisabled', disabled)}
            <Title level={2}>{action === 'create' ? 'Create Course' : action === 'edit' ? 'Edit Course' : action === 'delete' ? 'Delete Course' : 'Enquiry Course'}</Title>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Card>
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <CourseFormFields form={form} disabled={disabled} frequencyOptions={frequencyOptions} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
                        <Row justify="space-between" gutter={16}>
                            {action !== 'enquiry' && (
                                <Col>
                                    <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
                                        {capitalizeFirstLetter(action)}
                                    </Button>
                                </Col>
                            )}
                            <Col>
                                <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default CourseForm;
