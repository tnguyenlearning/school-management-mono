import React, { useEffect, useState } from 'react';
import { Button, Table, message, Spin, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '~/common/services/apis/courseApis';
import urls from '~/common/configs/urls';
import CourseActions from './CourseActions';

const { Title } = Typography;

const CoursesMPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        const { response, errorMessage } = await getCourses();
        setLoading(false);
        if (response) {
            setCourses(response);
        } else {
            message.error(errorMessage || 'Failed to load courses.');
        }
    };

    const handleNavigation = (action, course = null) => {
        let path = getNavigationPath(action, course);
        navigate(path, course ? { state: { course } } : undefined);
    };

    const getNavigationPath = (action, course) => {
        switch (action) {
            case 'generate-session':
                return urls.generateSession.replace(':courseId?', course?.id ?? '');
            case 'manage-sessions':
                return urls.manageSession.replace(':courseId?', course?.id ?? '');
            case 'edit':
            case 'enquiry':
            case 'delete':
                return course ? `${urls.baseCourseForm}/${action}/${course.id}` : `${urls.baseCourseForm}/${action}`;
            case 'manage-student-incourse':
                return `/courses/${course.id}/manage-student-incourse`;
            case 'create':
            default:
                return `${urls.baseCourseForm}/${action}`;
        }
    };

    const columns = [
        {
            title: 'Course Code',
            dataIndex: 'code',
            width: '20%',
        },
        {
            title: 'Course Name',
            dataIndex: 'name',
            width: '40%',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => <CourseActions course={record} handleNavigation={handleNavigation} />,
            width: '30%',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Title level={2}>Courses Management</Title>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => handleNavigation('create')} style={{ marginBottom: '16px' }}>
                        Create New Course
                    </Button>
                </Col>
            </Row>
            {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={courses} rowKey="id" pagination={{ pageSize: 10 }} locale={{ emptyText: 'No courses available' }} />}
        </div>
    );
};

export default CoursesMPage;
