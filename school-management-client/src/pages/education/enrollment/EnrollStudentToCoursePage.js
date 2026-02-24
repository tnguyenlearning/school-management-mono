import React, { useState, useEffect } from 'react';
import { Form, Button, message, DatePicker, Select, Card, Typography } from 'antd';
import { addStudentToCourse } from '~/common/services/apis/enrollmentApis';
import { useParams, useNavigate } from 'react-router-dom';
import { EnrollmentStatus } from '~/common/constants/app-enums';
import FormItem from '~/components/FormItem';
import urls from '~/common/configs/urls';
import { getCourseById } from '~/common/services/apis/courseApis';
import { getAllowedFrequencyByCourseId } from '~/common/services/apis/courseAllowedFreqApis';
import SelectFrequencyOptions from '~/pages/components/Frequency/SelectFrequencyOptions';

const { Option } = Select;
const { Title } = Typography;

const EnrollStudentToCoursePage = () => {
    const { courseId, studentId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isAdding, setIsAdding] = useState(false);
    const [frequencyOptions, setFrequencyOptions] = useState([]);
    const [courseDetails, setCourseDetails] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const { response, errorMessage } = await getCourseById(courseId);
            if (errorMessage) {
                message.error(`Failed to load course details: ${errorMessage}`);
            } else {
                setCourseDetails(response);
                fetchAllowedFrequencyOptions(courseId); // Fetch allowed frequency options
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const fetchAllowedFrequencyOptions = async (courseId) => {
        const { response, errorMessage } = await getAllowedFrequencyByCourseId(courseId);
        if (errorMessage) {
            message.error(`Failed to load allowed frequency options: ${errorMessage}`);
        } else {
            setFrequencyOptions(response); // Set the frequency options
            setSelectedOptions([]); // Clear any previously selected options
        }
    };

    const handleEnrollStudent = async (values) => {
        if (selectedOptions.length === 0) {
            message.error('Please select at least one frequency option.');
            return;
        }
        const enrollmentData = {
            ...values,
            courseId,
            studentId,
            startDate: values.startDate.format('YYYY-MM-DD'),
            enrollmentDate: values.enrollmentDate.format('YYYY-MM-DD'),
            billingFrequencyOptionId: selectedOptions[0].id, // Use the selected option
        };

        setIsAdding(true);
        const { errorMessage } = await addStudentToCourse(enrollmentData);

        if (errorMessage) {
            message.error(`Failed to add student: ${errorMessage}`);
        } else {
            message.success('Student added successfully.');
            navigate(urls.courseStudentManage.replace(':courseId?', courseId));
        }

        setIsAdding(false);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Enrollment</Title>
            {courseDetails && (
                <Card style={{ marginBottom: '20px' }}>
                    <Title level={4}>Course Information</Title>
                    <p>
                        <strong>Course Name:</strong> {courseDetails.name}
                    </p>
                    <p>
                        <strong>Course Description:</strong> {courseDetails.description}
                    </p>
                    <p>
                        <strong>Start Date:</strong> {courseDetails.startDate}
                    </p>
                    <p>
                        <strong>End Date:</strong> {courseDetails.endDate || 'N/A'}
                    </p>
                </Card>
            )}
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEnrollStudent}
                    initialValues={{
                        status: '',
                        enrollmentDate: null,
                    }}
                >
                    <FormItem
                        label="Status"
                        name="status"
                        rules={[{ required: true }]}
                        element={
                            <Select placeholder="Select status">
                                {Object.entries(EnrollmentStatus).map(([key, value]) => (
                                    <Option key={key} value={key}>
                                        {value}
                                    </Option>
                                ))}
                            </Select>
                        }
                    />
                    <FormItem label="Enrollment Date" name="enrollmentDate" rules={[{ required: true }]} element={<DatePicker format="YYYY-MM-DD" />} />
                    <FormItem label="Start Date" name="startDate" rules={[{ required: true }]} element={<DatePicker format="YYYY-MM-DD" />} />
                    <FormItem label="End Date" name="endDate" element={<DatePicker format="YYYY-MM-DD" />} />

                    <SelectFrequencyOptions
                        frequencyOptions={frequencyOptions}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions} // Allow re-selection
                    />

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isAdding}>
                            Enroll
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={handleCancel} loading={isAdding}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EnrollStudentToCoursePage;
