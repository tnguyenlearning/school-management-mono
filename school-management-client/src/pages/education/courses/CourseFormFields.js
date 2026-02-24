import React from 'react';
import { Row, Col, Input, DatePicker, TimePicker, Select, Form } from 'antd';
import { DayOfWeekEnum } from '~/common/constants/DayOfWeekEnum';
import { CourseStatus } from '~/common/constants/app-enums';
import AddingFrequencyOptions from '../../components/Frequency/AddingFrequencyOptions';

const { Option } = Select;

const FormItem = ({ label, name, rules, children, disabled }) => (
    <Form.Item label={label} name={name} rules={rules}>
        {React.cloneElement(children, { disabled })}
    </Form.Item>
);

const CourseFormFields = ({ form, disabled, frequencyOptions, selectedOptions, setSelectedOptions }) => (
    <>
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <FormItem label="Course Code" name="code" rules={[{ required: true, message: 'Course Code is required' }]} disabled={disabled}>
                    <Input />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="Course Name" name="name" rules={[{ required: true, message: 'Course Name is required' }]} disabled={disabled}>
                    <Input />
                </FormItem>
            </Col>
            <Col span={24}>
                <FormItem label="Description" name="description" rules={[{ required: true, message: 'Description is required' }]} disabled={disabled}>
                    <Input.TextArea rows={4} />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="Status" name="status" rules={[{ required: true, message: 'Status is required' }]} disabled={disabled}>
                    <Select placeholder="Select status">
                        {Object.entries(CourseStatus).map(([key, value]) => (
                            <Option key={key} value={key}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="Start Date" name="startDate" rules={[{ required: true, message: 'Start Date is required' }]} disabled={disabled}>
                    <DatePicker format="YYYY-MM-DD" />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="End Date" name="endDate" disabled={disabled}>
                    <DatePicker format="YYYY-MM-DD" />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="Start Time" name="startTime" rules={[{ required: true, message: 'Start Time is required' }]} disabled={disabled}>
                    <TimePicker format="HH:mm:ss" />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="End Time" name="endTime" rules={[{ required: true, message: 'End Time is required' }]} disabled={disabled}>
                    <TimePicker format="HH:mm:ss" />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label="Days of Week" name="daysOfWeek" rules={[{ required: true, message: 'Days of Week are required' }]} disabled={disabled}>
                    <Select mode="multiple" placeholder="Select days of the week">
                        {Object.values(DayOfWeekEnum).map((day) => (
                            <Option key={day} value={day}>
                                {day}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <AddingFrequencyOptions frequencyOptions={frequencyOptions} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} disabled={disabled} />
    </>
);

export default CourseFormFields;
