import React, { useState } from 'react';
import { Card, Table, message, Pagination, Input, Select, Button } from 'antd';
import { filterBillingCycles } from '~/common/services/apis/billingApis';
import { BillingCycleStatus } from '~/common/constants/app-enums';
import DateRangeFilterForm from '~/common/components/DateRangeFilterForm';

const { Option } = Select;

const BillingsEnquiryPage = () => {
    const [billingCycles, setBillingCycles] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({});

    const fetchBillingCycles = async (page = 0, pageSize, appliedFilters = filters) => {
        try {
            const { response, errorMessage } = await filterBillingCycles({ ...appliedFilters, page, size: pageSize });
            if (errorMessage) {
                message.error(errorMessage);
            } else {
                setBillingCycles(response.content);
                setPagination({ ...pagination, total: response.totalElements, current: page + 1 }); // Adjust current page for UI
            }
        } catch (error) {
            message.error('Failed to fetch billing cycles. Please try again.');
        }
    };

    const handlePageChange = (page, pageSize) => {
        fetchBillingCycles(page - 1, pageSize); // Subtract 1 to start from 0
    };

    const handleFilterSubmit = (values) => {
        const formattedValues = {
            ...values,
            startDate: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : undefined,
            endDate: values.dateRange ? values.dateRange[1].format('YYYY-MM-DD') : undefined,
        };
        delete formattedValues.dateRange;
        setFilters(formattedValues);
        fetchBillingCycles(0, pagination.pageSize, formattedValues);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Student Code', dataIndex: 'studentCode', key: 'studentCode' },
        { title: 'Enrollment ID', dataIndex: 'enrollmentId', key: 'enrollmentId' },
        { title: 'Billing Option Name', dataIndex: ['billingFrequencyOption', 'name'], key: 'billingOptionName' },
        { title: 'Frequency', dataIndex: ['billingFrequencyOption', 'frequency'], key: 'frequency' },
        { title: 'Fee Amount', dataIndex: ['billingFrequencyOption', 'feeAmount'], key: 'feeAmount' },
        { title: 'Is Active', dataIndex: ['billingFrequencyOption', 'isActive'], key: 'isActive', render: (isActive) => (isActive ? 'Yes' : 'No') },
        { title: 'Generated Date', dataIndex: 'generatedDate', key: 'generatedDate' },
        { title: 'Cycle Start Date', dataIndex: 'cycleStartDate', key: 'cycleStartDate' },
        { title: 'Cycle End Date', dataIndex: 'cycleEndDate', key: 'cycleEndDate' },
        { title: 'Total Learning Days', dataIndex: 'totalLearningDays', key: 'totalLearningDays' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Cycle Number', dataIndex: 'cycleNum', key: 'cycleNum' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Enquiry Billings Detail</h1>
            <Card bordered={false}>
                <p>Here you can enquire detailed billing information for students.</p>
                <DateRangeFilterForm
                    onSubmit={handleFilterSubmit}
                    extraFields={
                        <>
                            <Input placeholder="Student Code" name="studentCode" />
                            <Input placeholder="Enrollment ID" name="enrollmentId" />
                            <Input placeholder="Cycle Number" name="cycleNum" />
                            <Select placeholder="Status" name="status">
                                {Object.keys(BillingCycleStatus).map((key) => (
                                    <Option key={key} value={BillingCycleStatus[key]}>
                                        {BillingCycleStatus[key]}
                                    </Option>
                                ))}
                            </Select>
                        </>
                    }
                />
                <Table columns={columns} dataSource={billingCycles} pagination={false} rowKey="id" />
                <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} style={{ marginTop: '20px' }} />
            </Card>
        </div>
    );
};

export default BillingsEnquiryPage;
