import React, { useState } from 'react';
import { Input, List, Button, message, Spin, Row, Col, Card, Typography, Select } from 'antd';
import { searchStudentsByPhoneNotEnrolled, searchStudentsByStudentCodeNotEnrolled, searchStudentsByFirstNameNotEnrolled } from '~/common/services/apis/enrollmentApis';
import { useParams, useNavigate } from 'react-router-dom';
import urls from '~/common/configs/urls';

const { Title } = Typography;
const { Option } = Select;

const EligibleStudentsEnrollPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchType) {
            message.error('Please enter a search term and select a search type.');
            return;
        }

        setIsSearching(true);
        let response = null;
        let errorMessage = null;

        switch (searchType) {
            case 'phone':
                ({ response, errorMessage } = await searchStudentsByPhoneNotEnrolled(courseId, searchTerm));
                break;
            case 'studentCode':
                ({ response, errorMessage } = await searchStudentsByStudentCodeNotEnrolled(courseId, searchTerm));
                break;
            case 'firstName':
                ({ response, errorMessage } = await searchStudentsByFirstNameNotEnrolled(courseId, searchTerm));
                break;
            default:
                break;
        }

        if (errorMessage) {
            message.error(`Failed to search students: ${errorMessage}`);
        } else {
            setSearchResults(response || []);
        }

        setIsSearching(false);
    };

    const navigateToEnroll = (student) => {
        navigate(`/course/${courseId}/enroll-student/${student.id}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Enroll Students to Course</Title>
            <Card>
                <Row gutter={16}>
                    <Col span={8}>
                        <Select placeholder="Select search type" value={searchType} onChange={(value) => setSearchType(value)} style={{ width: '100%', marginBottom: '8px' }}>
                            <Option value="phone">Phone Number</Option>
                            <Option value="studentCode">Student Code</Option>
                            <Option value="firstName">First Name</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Input placeholder="Enter search term" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ marginBottom: '8px' }} />
                    </Col>
                    <Col span={8}>
                        <Button type="primary" onClick={handleSearch} disabled={isSearching} loading={isSearching} style={{ width: '100%' }}>
                            Search
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Spin spinning={isSearching}>
                <List
                    bordered
                    dataSource={searchResults}
                    renderItem={(student) => (
                        <List.Item
                            actions={[
                                <Button type="primary" onClick={() => navigateToEnroll(student)}>
                                    Enroll
                                </Button>,
                            ]}
                        >
                            {`${student.studentCode} - ${student.firstName} ${student.lastName} (${student.phoneNumber})`}
                        </List.Item>
                    )}
                    style={{ marginTop: '16px' }}
                />
            </Spin>
        </div>
    );
};

export default EligibleStudentsEnrollPage;
