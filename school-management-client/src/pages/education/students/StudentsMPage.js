import { Button, Input, notification, Row, Col, Space, Select, Pagination } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import urls from '~/common/configs/urls';
import { getStudentByStudentCode, getStudentByPhone, getStudentByFirstName, getStudents } from '~/common/services/apis/studentApis';
import StudentTable from './StudentTable';

const { Option } = Select;

const StudentsMPage = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('code');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const searchInputRef = useRef(null);
    const location = useLocation();

    const { lastSearch, formResponse } = location.state || {};

    useEffect(() => {
        if (formResponse) {
            notification.success({
                message: `${formResponse.action} Successful`,
                description: formResponse.message,
            });
            // Clear formResponse after showing notification
            navigate(location.pathname, { replace: true, state: { lastSearch } });
        }
    }, [formResponse, navigate, location.pathname, lastSearch]);

    useEffect(() => {
        if (lastSearch) {
            setSearch(lastSearch);
            searchInputRef.current?.focus();
        }
    }, [lastSearch]);

    const handleOnChange = (value) => {
        setSearch(value);
    };

    const handleSearchTypeChange = (value) => {
        setSearchType(value);
    };

    const handleSearch = async () => {
        setLoading(true);
        let response, errorMessage;
        switch (searchType) {
            case 'code':
                ({ response, errorMessage } = await getStudentByStudentCode(search));
                break;
            case 'phone':
                ({ response, errorMessage } = await getStudentByPhone(search));
                break;
            case 'firstName':
                ({ response, errorMessage } = await getStudentByFirstName(search));
                break;
            default:
                break;
        }
        setLoading(false);
        if (errorMessage) {
            notification.error({
                message: 'Error Loading Students',
                description: errorMessage,
            });
            setStudents([]);
        } else {
            setStudents(response ? response : []);
        }
    };

    const handleEnquiry = (record) => {
        navigate(`${urls.baseStudentForm}/enquiry/${record.id}`, { state: { actionType: 'enquiry', studentData: record, lastSearch: search } });
    };

    const handleEdit = (record) => {
        navigate(`${urls.baseStudentForm}/edit/${record.id}`, { state: { actionType: 'edit', studentData: record, lastSearch: search } });
    };

    const handleDelete = (record) => {
        navigate(`${urls.baseStudentForm}/delete/${record.id}`, { state: { actionType: 'delete', studentData: record, lastSearch: search } });
    };

    const handleCreate = () => {
        navigate(`${urls.baseStudentForm}/create`, { state: { actionType: 'create', lastSearch: search } });
    };

    return (
        <div>
            <Row gutter={[16, 16]} className="action">
                <Col span={6}>
                    <Select defaultValue="code" onChange={handleSearchTypeChange} style={{ width: '100%' }}>
                        <Option value="code">Student Code</Option>
                        <Option value="phone">Phone Number</Option>
                        <Option value="firstName">First Name</Option>
                    </Select>
                </Col>
                <Col span={12}>
                    <Input placeholder="Search" onChange={(e) => handleOnChange(e.target.value)} ref={searchInputRef} value={search} style={{ marginBottom: 20, width: '100%' }} />
                </Col>
                <Col span={6}>
                    <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
                        Search
                    </Button>
                </Col>
                <Col span={6}>
                    <Button type="default" onClick={handleCreate} style={{ width: '100%' }}>
                        Create
                    </Button>
                </Col>
            </Row>
            <StudentTable students={students} onEnquiry={handleEnquiry} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
        </div>
    );
};

export default StudentsMPage;
