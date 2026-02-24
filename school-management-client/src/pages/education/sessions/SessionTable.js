import { Table, Button, Select } from 'antd';
import { SessionStatus } from '~/common/constants/SessionStatus';

const { Option } = Select;

const SessionTable = ({ sessions, initialStatuses, handleStatusChange, openRemarkModal, openTimeAdjustmentModal, handleUpdateSession, hasSessionChanged }) => {
    const columns = [
        {
            title: 'Session Date',
            dataIndex: 'sessionDate',
        },
        {
            title: 'Initial Status',
            render: (text, record) => <span>{initialStatuses[record.id]?.status}</span>,
        },
        {
            title: 'Current Status',
            render: (text, record) => (
                <Select value={record.status} onChange={(value) => handleStatusChange(record.id, value)} style={{ width: 150 }}>
                    {SessionStatus.map((status) => (
                        <Option key={status} value={status}>
                            {status}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Remark',
            render: (text, record) => <Button onClick={() => openRemarkModal(record)}>{record.remark ? 'Edit Remark' : 'Add Remark'}</Button>,
        },
        {
            title: 'Time Adjustment',
            render: (text, record) => (
                <Button onClick={() => openTimeAdjustmentModal(record)} disabled={record.status === 'CANCELED'}>
                    Adjust Time
                </Button>
            ),
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Button onClick={() => handleUpdateSession(record.id)} disabled={!hasSessionChanged(record.id)}>
                    Save
                </Button>
            ),
        },
    ];

    return <Table columns={columns} dataSource={sessions} rowKey="id" />;
};

export default SessionTable;
