import React from 'react';
import { Table, Button } from 'antd';

const StudentTable = ({ students, onEnquiry, onEdit, onDelete }) => {
    const columns = [
        { title: 'Student Code', dataIndex: 'studentCode' },
        { title: 'First Name', dataIndex: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phoneNumber' },
        {
            title: 'Actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => onEnquiry(record)} type="primary">
                        Enquiry
                    </Button>
                    <Button onClick={() => onEdit(record)} type="primary" style={{ marginLeft: 10 }}>
                        Edit
                    </Button>
                    <Button onClick={() => onDelete(record.id)} type="danger" style={{ marginLeft: 10 }}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return <Table dataSource={students} columns={columns} rowKey="id" />;
};

export default StudentTable;
