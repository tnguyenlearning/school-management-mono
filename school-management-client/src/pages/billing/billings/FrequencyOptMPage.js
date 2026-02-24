import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getFrequencyOptions, deleteFrequencyOption, createFrequencyOption, updateFrequencyOption } from '~/common/services/apis/frequencyApis';
import urls from '~/common/configs/urls';

const FrequencyOptMPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFrequencyOptions();
    }, []);

    const fetchFrequencyOptions = async () => {
        setLoading(true);
        const { response, errorMessage } = await getFrequencyOptions();
        if (errorMessage) {
            showErrorNotification('Failed to load frequency options', errorMessage);
        } else {
            setData(response);
        }
        setLoading(false);
    };

    const handleNavigation = (action, frequencyOption = null) => {
        console.log('action', action, 'frequencyOption', frequencyOption);
        let path = getNavigationPath(action, frequencyOption);
        navigate(path, frequencyOption ? { state: { frequencyOption } } : undefined);
    };

    const getNavigationPath = (action, frequencyOption) => {
        switch (action) {
            case 'edit':
            case 'view':
            case 'delete':
            case 'inquiry':
                return frequencyOption ? `${urls.baseFrequencyOptForm}/${action}/${frequencyOption.id}` : `${urls.baseFrequencyOptForm}/${action}`;
            case 'create':
            default:
                return `${urls.baseFrequencyOptForm}/${action}`;
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this frequency option?',
            onOk: async () => {
                const { response, errorMessage } = await deleteFrequencyOption(id);
                if (errorMessage) {
                    showErrorNotification('Failed to delete frequency option', errorMessage);
                } else {
                    message.success('Frequency option deleted successfully.');
                    fetchFrequencyOptions();
                }
            },
        });
    };

    const showErrorNotification = (message, description) => {
        notification.error({
            message,
            description,
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button onClick={() => handleNavigation('edit', record)}>Edit</Button>
                    <Button onClick={() => handleNavigation('inquiry', record)}>Inquiry</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Frequency Options</h1>
            <Button type="primary" onClick={() => handleNavigation('create')}>Add New Frequency Option</Button>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" style={{ marginTop: '20px' }} />
        </div>
    );
};

export default FrequencyOptMPage;
