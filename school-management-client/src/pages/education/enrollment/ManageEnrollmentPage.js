import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import moment from 'moment';
import { getStudentWithEnrollmentByEnrollmentId, updateEnrollmentById } from '~/common/services/apis/enrollmentApis';
import { getCourseById } from '~/common/services/apis/courseApis'; // Import the API to fetch course details
import FormItem from '~/components/FormItem';
import { EnrollmentStatus } from '~/common/constants/app-enums';

const { Option } = Select;

const ManageEnrollmentPage = () => {
    const { courseId, studentId, enrollmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [frequencyOptions, setFrequencyOptions] = useState([]); // Add state to store frequency options
    const [courseInfo, setCourseInfo] = useState({}); // Add state to store course information
    const [studentInfo, setStudentInfo] = useState({}); // Add state to store student information

    useEffect(() => {
        if (location.state) {
            setLoading(false);
            const stateWithMomentDates = {
                ...location.state,
                enrollmentDate: moment(location.state.enrollmentDate),
                startDate: moment(location.state.startDate),
                endDate: moment(location.state.endDate),
                frequencyOptionId: location.state.frequencyOptions.find((option) => option.frequency === location.state.frequencyOption)?.id,
                status: location.state.enrollmentStatus, // Initialize status
            };
            form.setFieldsValue(stateWithMomentDates);
            setFrequencyOptions(location.state.frequencyOptions); // Set frequency options from the passed state
            setCourseInfo(location.state.courseInfo); // Set course information from the passed state
            setStudentInfo(location.state.studentInfo); // Set student information from the passed state
        } else {
            fetchStudentAndEnrollmentByEnrollmentId();
            fetchCourseDetails();
        }
    }, []);

    const fetchStudentAndEnrollmentByEnrollmentId = async () => {
        setLoading(true);
        const { response, errorMessage } = await getStudentWithEnrollmentByEnrollmentId(enrollmentId);
        if (errorMessage) {
            message.error(errorMessage || 'Failed to load enrollment details.');
        } else {
            const responseWithMomentDates = {
                ...response,
                enrollmentDate: moment(response.enrollmentDate),
                startDate: moment(response.startDate),
                endDate: moment(response.endDate),
                frequencyOptionId: response.frequencyOptionDto?.id,
                status: response.enrollmentStatus, // Initialize status
            };
            console.log('response.frequencyOptionDto?.frequency.id', response.frequencyOptionDto?.id);
            form.setFieldsValue(responseWithMomentDates);
            setStudentInfo({ firstName: response.firstName, email: response.email, phoneNumber: response.phoneNumber }); // Set student information from the response
        }
        setLoading(false);
    };

    const fetchCourseDetails = async () => {
        const { response, errorMessage } = await getCourseById(courseId);
        if (errorMessage) {
            message.error(errorMessage || 'Failed to load course details.');
        } else {
            setCourseInfo(response);
            setFrequencyOptions(response.frequencyOptions); // Set frequency options from the course details
        }
    };

    const handleUpdate = async (values) => {
        const { frequencyOptionId, ...restValues } = values;
        const enrollmentData = {
            ...restValues,
            frequencyOption: {
                id: frequencyOptionId,
            },
        };
        const { errorMessage } = await updateEnrollmentById(enrollmentId, enrollmentData);
        if (errorMessage) {
            message.error(`Failed to update enrollment details: ${errorMessage}`);
        } else {
            message.success('Enrollment details updated successfully.');
            navigate(-1);
        }
    };

    return (
        <div>
            <h2>Manage Enrollment</h2>
            <div>
                <p>
                    <strong>Course Name:</strong> {courseInfo.name}
                </p>
                <p>
                    <strong>Course Description:</strong> {courseInfo.description}
                </p>
                <p>
                    <strong>Student Name:</strong> {`${studentInfo.firstName} ${studentInfo.lastName}`}
                </p>
                <p>
                    <strong>Student Email:</strong> {studentInfo.email}
                </p>
                <p>
                    <strong>Student Phone Number:</strong> {studentInfo.phoneNumber}
                </p>
            </div>
            <Form form={form} onFinish={handleUpdate} layout="vertical">
                <Form.Item name="enrollmentId" label="Enrollment ID">
                    <Input disabled />
                </Form.Item>
                <Form.Item name="enrollmentDate" label="Enrollment Date">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="startDate" label="Start Date">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="endDate" label="End Date">
                    <DatePicker />
                </Form.Item>
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
                <FormItem
                    label="Frequency Option"
                    name="frequencyOptionId"
                    rules={[{ required: true }]}
                    element={
                        <Select placeholder="Select frequency option">
                            {frequencyOptions.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {`${option.frequency} - ${option.totalLearningDays ? option.totalLearningDays : 0} days - $${option.feeAmount}`}
                                </Option>
                            ))}
                        </Select>
                    }
                />
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                    <Button onClick={() => navigate(-1)} style={{ marginLeft: '8px' }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ManageEnrollmentPage;
