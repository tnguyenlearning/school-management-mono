import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import StudentAccountSearch from './StudentAccountSearch';
import StudentAccountTable from './StudentAccountTable';
import { searchStudentAccounts } from '~/common/services/apis/studentAccountApis';
import urls from '~/common/configs/urls';

const StudentAccountMPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (params) => {
        setSearchParams(params);
        setLoading(true);
        try {
            const { response } = await searchStudentAccounts(params);
            setData(response.content); // Adjusted to use `content` from paginated response
        } catch (error) {
            console.error('Failed to fetch student accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => navigate(`${urls.baseStudentAccountForm}/create`)}>
                    Create Student Account
                </Button>
            </Space>
            <StudentAccountSearch onSearch={handleSearch} />
            <StudentAccountTable data={data} loading={loading} />
        </div>
    );
};

export default StudentAccountMPage;
