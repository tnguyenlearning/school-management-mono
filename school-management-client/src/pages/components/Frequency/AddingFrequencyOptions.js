import React, { useState, useEffect } from 'react';
import { Row, Col, Select, InputNumber, Button, Card, Typography, Switch } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;

const AddingFrequencyOptions = ({ frequencyOptions, selectedOptions, setSelectedOptions, disabled }) => {
    const [selectedFrequency, setSelectedFrequency] = useState(null);

    useEffect(() => {
        // Ensure selectedOptions is updated when frequencyOptions change
        setSelectedOptions(selectedOptions);
    }, [selectedOptions]);

    const handleAddFrequencyDetail = () => {
        if (selectedFrequency) {
            const newOption = { ...selectedFrequency, isActive: true };
            const updatedOptions = [...selectedOptions, newOption];
            setSelectedOptions(updatedOptions);
            setSelectedFrequency(null);
        }
    };

    const handleRemoveFrequencyDetail = (index) => {
        const updatedDetails = selectedOptions.filter((_, i) => i !== index);
        setSelectedOptions(updatedDetails);
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

    const FrequencyDetailRow = ({ detail, index }) => (
        <Row gutter={16} key={index} style={{ marginBottom: 10 }}>
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
            <Col span={2}>
                {!disabled && (
                    <Button type="primary" danger ghost onClick={() => handleRemoveFrequencyDetail(index)}>
                        Remove
                    </Button>
                )}
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
                    <Button type="primary" ghost onClick={handleAddFrequencyDetail} disabled={disabled}>
                        Add
                    </Button>
                </Col>
            </Row>
            {selectedOptions.map((detail, index) => (
                <FrequencyDetailRow key={index} detail={detail} index={index} />
            ))}
        </Card>
    );
};

export default AddingFrequencyOptions;
