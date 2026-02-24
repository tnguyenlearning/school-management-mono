import React, { useState } from 'react';
import { Input, Button, message, Space } from 'antd';
import { generateSessionsForCourse } from '~/common/services/apis/educations/classSessionApis';

const GenerateSessionInline = ({ course, onSuccess }) => {
    const [monthsAhead, setMonthsAhead] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleGenerateSessions = async () => {
        if (!course) {
            message.error('Course info not loaded.');
            return;
        }
        setLoading(true);
        const { response, errorMessage } = await generateSessionsForCourse(course.id, monthsAhead);
        setLoading(false);
        if (response) {
            message.success('Sessions generated successfully!');
            if (onSuccess) onSuccess();
        } else {
            message.error(errorMessage || 'Failed to generate sessions.');
        }
    };

    return (
        <Space style={{ marginTop: 16 }}>
            <Input type="number" min={0} value={monthsAhead} onChange={(e) => setMonthsAhead(Number(e.target.value))} prefix="Months:" style={{ width: 220 }} disabled={loading} />
            <Button type="primary" onClick={handleGenerateSessions} loading={loading}>
                Generate Sessions
            </Button>
        </Space>
    );
};

export default GenerateSessionInline;
