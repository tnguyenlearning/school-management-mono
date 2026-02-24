import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Spin, message, Typography, Space, Popconfirm } from 'antd';
import { getStudentsWithEnrollmentsByCourseId, removeStudentFromCourse } from '~/common/services/apis/enrollmentApis';
import { getCourseById } from '~/common/services/apis/courseApis'; // Import the API to fetch course details

const { Title } = Typography;

const CourseStudentsMPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState({});
    const [courseInfo, setCourseInfo] = useState({}); // Add state to store course information

    useEffect(() => {
        fetchStudentsWithEnrollmentsOfCourse();
        fetchCourseDetails(); // Fetch course details when the component mounts
    }, []);

    const fetchStudentsWithEnrollmentsOfCourse = async () => {
        setLoading(true);
        const { response, errorMessage } = await getStudentsWithEnrollmentsByCourseId(courseId);
        if (errorMessage) {
            message.error(errorMessage || 'Failed to load students.');
        } else {
            const studentsWithFrequency = response.map((student) => ({
                ...student,
                frequencyOption: student.frequencyOptionDto?.frequency || 'N/A',
            }));
            setStudents(studentsWithFrequency);
        }
        setLoading(false);
    };

    const fetchCourseDetails = async () => {
        const { response, errorMessage } = await getCourseById(courseId);
        if (errorMessage) {
            message.error(errorMessage || 'Failed to load course details.');
        } else {
            setCourseInfo(response);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        setRemoving((prev) => ({ ...prev, [studentId]: true }));
        const { errorMessage } = await removeStudentFromCourse(courseId, studentId);
        if (errorMessage) {
            message.error(`Failed to remove student: ${errorMessage}`);
        } else {
            setStudents((prevStudents) => prevStudents.filter((student) => student.studentId !== studentId));
            message.success('Student removed successfully.');
        }
        setRemoving((prev) => ({ ...prev, [studentId]: false }));
    };

    const handleManageEnrollment = (student) => {
        navigate(`/course/${courseId}/student/${student.studentId}/enrollment/${student.enrollmentId}/manage`, {
            state: {
                enrollmentId: student.enrollmentId,
                enrollmentDate: student.enrollmentDate,
                startDate: student.startDate,
                endDate: student.endDate,
                enrollmentStatus: student.enrollmentStatus,
                frequencyOption: student.frequencyOption,
                frequencyOptions: courseInfo.frequencyOptions, // Pass frequency options to the next page
                courseInfo: courseInfo, // Pass course information to the next page
                studentInfo: {
                    // Pass student information to the next page
                    studentId: student.studentId,
                    studentCode: student.studentCode,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    gender: student.gender,
                    age: student.age,
                    email: student.email,
                    phoneNumber: student.phoneNumber,
                    address: student.address,
                },
            },
        });
    };

    const columns = [
        { title: 'Student Code', dataIndex: 'studentCode', key: 'studentCode' },
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
        { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
        { title: 'Status', dataIndex: 'enrollmentStatus', key: 'enrollmentStatus' },

        {
            title: 'Actions',
            key: 'actions',
            render: (_, student) => (
                <Space>
                    <Button type="default" onClick={() => handleManageEnrollment(student)}>
                        Manage Enrollment
                    </Button>
                    <Popconfirm title="Are you sure you want to remove this student?" onConfirm={() => handleRemoveStudent(student.studentId)} okText="Yes" cancelText="No">
                        <Button type="primary" danger disabled={removing[student.studentId]}>
                            {removing[student.studentId] ? <Spin size="small" /> : 'Remove'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Students in Course</Title>
            <div>
                <p>
                    <strong>Course Name:</strong> {courseInfo.name}
                </p>
                <p>
                    <strong>Course Description:</strong> {courseInfo.description}
                </p>
            </div>
            <Button type="primary" onClick={() => navigate(`/course/${courseId}/student-enroll`)} style={{ marginBottom: '16px' }}>
                Enroll Students
            </Button>
            {loading ? (
                <Spin tip="Loading students..." size="large" />
            ) : students.length === 0 ? (
                <p>No students enrolled in this course.</p>
            ) : (
                <Table columns={columns} dataSource={students} rowKey="studentId" pagination={{ pageSize: 10 }} />
            )}
        </div>
    );
};

export default CourseStudentsMPage;
