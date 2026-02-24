import React, { useState, useEffect } from 'react';
import { Row, Col, Select, InputNumber, Button, Card, Typography, Switch } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;

const SelectFrequencyOptions = ({ frequencyOptions, selectedOptions, setSelectedOptions, disabled }) => {
    const [selectedFrequency, setSelectedFrequency] = useState(null);

    useEffect(() => {
        // Ensure selectedOptions is updated when frequencyOptions change
        setSelectedOptions(selectedOptions);
    }, [selectedOptions]);

    const handleSelectFrequencyDetail = () => {
        if (selectedFrequency) {
            const newOption = { ...selectedFrequency, isActive: true };
            setSelectedOptions([newOption]); // Replace the selected option with the new one
        }
    };

    const isOptionDisabled = (optionName) => {
        return selectedOptions.some((option) => option.name === optionName);
    };

    const FrequencySelect = ({ value, onChange, disabled }) => (
        <Select
            placeholder="Select frequency"
            value={value ? value.name : undefined}
            onChange={(name) => {
                const selectedOption = frequencyOptions.find((option) => option.name === name);
                onChange(selectedOption);
            }}
            style={{ width: '100%' }}
            disabled={disabled}
        >
            {frequencyOptions.map((option) => (
                <Option key={option.name} value={option.name} disabled={isOptionDisabled(option.name)}>
                    {option.name}
                </Option>
            ))}
        </Select>
    );

    const FrequencyDetailRow = ({ detail }) => (
        <Row gutter={16} style={{ marginBottom: 10 }}>
            <Col span={4}>
                <Text>{detail.name}</Text>
            </Col>
            <Col span={4}>
                <Text>{detail.frequency}</Text>
            </Col>
            <Col span={4}>
                <InputNumber value={detail.totalLearningDays} style={{ width: '100%' }} disabled />
            </Col>
            <Col span={4}>
                <InputNumber value={detail.feeAmount} style={{ width: '100%' }} disabled />
            </Col>
            <Col span={4}>
                <Switch checked={detail.isActive} disabled />
            </Col>
        </Row>
    );

    return (
        <Card>
            <Title level={4}>Frequency Details</Title>
            <Row gutter={16} style={{ marginBottom: 10 }}>
                <Col span={6}>
                    <FrequencySelect value={selectedFrequency} onChange={setSelectedFrequency} disabled={disabled} />
                </Col>
                <Col span={2}>
                    <Button type="primary" ghost onClick={handleSelectFrequencyDetail} disabled={!selectedFrequency || disabled}>
                        Select
                    </Button>
                </Col>
            </Row>
            {selectedOptions.length > 0 && <FrequencyDetailRow detail={selectedOptions[0]} />}
        </Card>
    );
};

export default SelectFrequencyOptions;
