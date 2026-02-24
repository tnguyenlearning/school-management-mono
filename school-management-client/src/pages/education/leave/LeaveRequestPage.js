import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, DatePicker, Select, message, Typography, Popconfirm } from 'antd';
import { createLeaveRequest, getLeaveRequestBySessionStudent, updateLeaveRequest, deleteLeaveRequest } from '~/common/services/apis/educations/leaveRequestApis';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const statusOptions = ['REQUESTED', 'APPROVED', 'REJECTED'];

const LeaveRequestPage = () => {
    const { courseId, studentId, sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Get leaveDate from query string
    const queryParams = new URLSearchParams(location.search);
    const leaveDateStr = queryParams.get('leaveDate');
    const leaveDate = leaveDateStr ? dayjs(leaveDateStr) : null;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [existingRequest, setExistingRequest] = useState(null);

    useEffect(() => {
        const fetchExisting = async () => {
            if (!sessionId || !studentId) return;
            const { response, errorMessage } = await getLeaveRequestBySessionStudent(sessionId, studentId);
            if (response) {
                setExistingRequest(response);
                form.setFieldsValue({
                    requestedDate: response.requestedDate ? dayjs(response.requestedDate) : null,
                    status: response.status || 'REQUESTED',
                    reason: response.reason || '',
                    remarks: response.remarks || '',
                    leaveDate: response.leaveDate ? dayjs(response.leaveDate) : leaveDate,
                });
            } else if (errorMessage) {
                message.error('Failed to load existing leave request: ' + errorMessage);
            }
        };
        fetchExisting();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, studentId]);

    const handleSubmit = async (values) => {
        setLoading(true);
        if (existingRequest) {
            const { response, errorMessage } = await updateLeaveRequest(existingRequest.id, {
                requestedDate: values.requestedDate.format('YYYY-MM-DD'),
                reason: values.reason,
                remarks: values.remarks,
            });
            setLoading(false);
            if (response) {
                message.success('Leave request updated!');
                navigate(-1);
            } else {
                message.error('Failed to update: ' + errorMessage);
            }
        } else {
            const payload = {
                student: `/students/${studentId}`,
                course: `/courses/${courseId}`,
                classSession: `/classSessions/${sessionId}`,
                leaveDate: leaveDate ? leaveDate.format('YYYY-MM-DD') : values.leaveDate.format('YYYY-MM-DD'),
                status: values.status,
                requestedDate: values.requestedDate.format('YYYY-MM-DD'),
                reason: values.reason,
                remarks: values.remarks,
            };
            const { response, errorMessage } = await createLeaveRequest(payload);
            setLoading(false);
            if (response) {
                message.success('Leave request submitted!');
                navigate(-1);
            } else {
                message.error('Failed: ' + errorMessage);
            }
        }
    };

    const handleDelete = async () => {
        if (!existingRequest) return;
        setLoading(true);
        const { response, errorMessage } = await deleteLeaveRequest(existingRequest.id);
        setLoading(false);
        navigate(-1);
    };

    return (
        <div style={{ background: '#f5f6fa', minHeight: '100vh', padding: '32px' }}>
            <Card style={{ maxWidth: 600, margin: '0 auto', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    Leave Request
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        leaveDate: leaveDate,
                        status: 'APPROVED',
                    }}
                >
                    <Form.Item label="Course ID">
                        <Input value={courseId} disabled />
                    </Form.Item>
                    <Form.Item label="Student ID">
                        <Input value={studentId} disabled />
                    </Form.Item>
                    <Form.Item label="Class Session ID">
                        <Input value={sessionId} disabled />
                    </Form.Item>
                    <Form.Item label="Leave Date" name="leaveDate" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} disabled />
                    </Form.Item>
                    <Form.Item label="Requested Date" name="requestedDate" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Status" name="status">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} maxLength={200} placeholder="Enter reason" />
                    </Form.Item>
                    <Form.Item label="Remarks" name="remarks" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} maxLength={200} placeholder="Enter remarks" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            {existingRequest ? 'Update Leave Request' : 'Submit Leave Request'}
                        </Button>
                    </Form.Item>
                    {existingRequest && (
                        <Form.Item>
                            <Popconfirm title="Are you sure to delete this leave request?" onConfirm={handleDelete} okText="Yes" cancelText="No">
                                <Button danger style={{ width: '100%' }} loading={loading}>
                                    Delete Leave Request
                                </Button>
                            </Popconfirm>
                        </Form.Item>
                    )}
                </Form>
            </Card>
        </div>
    );
};

export default LeaveRequestPage;
