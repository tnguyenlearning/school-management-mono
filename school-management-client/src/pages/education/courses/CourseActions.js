import React from 'react';
import { Button, Tooltip, Space } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined, PlayCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

const CourseActions = ({ course, handleNavigation }) => (
    <Space>
        <Tooltip title="Edit Course">
            <Button icon={<EditOutlined />} onClick={() => handleNavigation('edit', course)} type="default" />
        </Tooltip>
        <Tooltip title="Course Enquiry">
            <Button icon={<FileTextOutlined />} onClick={() => handleNavigation('enquiry', course)} type="default" />
        </Tooltip>
        <Tooltip title="Manage Student">
            <Button icon={<UserOutlined />} onClick={() => handleNavigation('manage-student-incourse', course)} type="default" />
        </Tooltip>
        <Tooltip title="Sessions Manage">
            <Button icon={<CalendarOutlined />} onClick={() => handleNavigation('manage-sessions', course)} type="primary" />
        </Tooltip>
        <Tooltip title="Delete Course">
            <Button icon={<DeleteOutlined />} onClick={() => handleNavigation('delete', course)} danger />
        </Tooltip>
    </Space>
);

export default CourseActions;
