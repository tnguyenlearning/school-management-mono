import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const SelectOption = ({
    options = [], // Array of options (e.g., [{value: 'male', label: 'Male'}])
    placeholder = '', // Placeholder text
    value, // Controlled value
    onChange, // Change handler
    allowClear = true, // Whether to allow clearing the selection
    disabled = false, // Whether to disable the select
}) => {
    return (
        <Select placeholder={placeholder} value={value} onChange={onChange} allowClear={allowClear} disabled={disabled}>
            {options.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
};

export default SelectOption;
