import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom'; // Use navigate from React Router v6
import urls from '~/common/configs/urls';

const AutoNumMPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const handleGenerateClick = () => {
        // Redirect to the generate page
        navigate(urls.generateAutoNum);
    };

    const handleReclaimClick = () => {
        // Redirect to the reclaim page
        navigate(urls.reclaimAutoNum);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2>Auto Number Management</h2>

            {/* Layout for two buttons */}
            <Row gutter={16}>
                <Col span={12}>
                    <Button type="primary" block onClick={handleGenerateClick} loading={loading}>
                        Go to Generate Numbers Page
                    </Button>
                </Col>
                <Col span={12}>
                    <Button type="primary" block onClick={handleReclaimClick} loading={loading}>
                        Go to Reclaim Number Page
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default AutoNumMPage;
