import React, { useState } from 'react';
import { Card, Button, Row, Col, message, Table, Input, Select, DatePicker, Form, Pagination, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import urls from '~/common/configs/urls';
import { getLeaveRequests, decideLeaveRequest, updateLeaveRequest } from '~/common/services/apis/educations/leaveRequestApis';
import moment from 'moment';
import { LeaveStatus } from '~/common/constants/app-enums';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LeaveMPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({
        leaveDateFrom: undefined,
        leaveDateTo: undefined,
        status: undefined,
        requestedDateFrom: undefined,
        requestedDateTo: undefined,
        decisionDateFrom: undefined,
        decisionDateTo: undefined,
        courseCode: '',
    });
    const [modal, setModal] = useState({ visible: false, type: '', record: null, remarks: '', decisionDate: null });
    const [editModal, setEditModal] = useState({ visible: false, record: null, reason: '' });

    const fetchData = async (params = {}) => {
        setLoading(true);
        const { response, errorMessage } = await getLeaveRequests({
            courseCode: filters.courseCode || '',
            leaveDateFrom: filters.leaveDateFrom ? filters.leaveDateFrom.format('YYYY-MM-DD') : '',
            leaveDateTo: filters.leaveDateTo ? filters.leaveDateTo.format('YYYY-MM-DD') : '',
            status: filters.status,

            requestedDateFrom: filters.requestedDateFrom ? filters.requestedDateFrom.format('YYYY-MM-DD') : '',
            requestedDateTo: filters.requestedDateTo ? filters.requestedDateTo.format('YYYY-MM-DD') : '',
            decisionDateFrom: filters.decisionDateFrom ? filters.decisionDateFrom.format('YYYY-MM-DD') : '',
            decisionDateTo: filters.decisionDateTo ? filters.decisionDateTo.format('YYYY-MM-DD') : '',
            page: (params.page || pagination.current) - 1,
            size: params.pageSize || pagination.pageSize,
        });
        if (response) {
            setData(response.content || response);
            setPagination({
                current: (response.pageable?.number || 0) + 1,
                pageSize: response.pageable?.size || 10,
                total: response.pageable?.totalElements || 0,
            });
        } else {
            message.error(errorMessage || 'Failed to load leave requests.');
        }
        setLoading(false);
    };

    const handleTableChange = (pag) => {
        setPagination({ ...pagination, current: pag.current, pageSize: pag.pageSize });
        fetchData({ page: pag.current, pageSize: pag.pageSize });
    };

    const handleSearch = (values) => {
        setFilters({
            ...filters,
            leaveDateFrom: values.leaveDateRange && values.leaveDateRange[0] ? values.leaveDateRange[0] : undefined,
            leaveDateTo: values.leaveDateRange && values.leaveDateRange[1] ? values.leaveDateRange[1] : undefined,
            requestedDateFrom: values.requestedDateRange && values.requestedDateRange[0] ? values.requestedDateRange[0] : undefined,
            requestedDateTo: values.requestedDateRange && values.requestedDateRange[1] ? values.requestedDateRange[1] : undefined,
            decisionDateFrom: values.decisionDateRange && values.decisionDateRange[0] ? values.decisionDateRange[0] : undefined,
            decisionDateTo: values.decisionDateRange && values.decisionDateRange[1] ? values.decisionDateRange[1] : undefined,
            status: values.status,
        });
        // Always reset to first page on new search
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchData({ page: 1, pageSize: pagination.pageSize });
    };

    const showDecisionModal = (type, record) => {
        setModal({ visible: true, type, record, remarks: '', decisionDate: null });
    };

    const handleModalOk = async () => {
        if (!modal.remarks) {
            message.error('Remarks are required.');
            return;
        }
        if (!modal.decisionDate) {
            message.error('Decision date is required.');
            return;
        }
        const status = modal.type === 'approve' ? 'APPROVED' : 'REJECTED';
        const { response, errorMessage } = await decideLeaveRequest(modal.record.id, status, {
            remarks: modal.remarks,
            decisionDate: modal.decisionDate ? modal.decisionDate.format('YYYY-MM-DD') : undefined,
        });
        if (response) {
            message.success(`Leave request ${status.toLowerCase()}.`);
            setModal({ ...modal, visible: false });
            fetchData();
        } else {
            message.error(errorMessage || `Failed to ${status.toLowerCase()} leave request.`);
        }
    };

    const handleModalCancel = () => {
        setModal({ ...modal, visible: false });
    };

    const showEditModal = (record) => {
        setEditModal({
            visible: true,
            record,
            reason: record.reason || '',
        });
    };

    const handleEditOk = async () => {
        const { record, reason } = editModal;
        if (!reason) {
            message.error('Reason is required.');
            return;
        }
        // Call PATCH API to update fields
        const { response, errorMessage } = await updateLeaveRequest(record.id, {
            reason,
        });
        if (response) {
            message.success('Leave request updated.');
            setEditModal({ ...editModal, visible: false });
            fetchData();
        } else {
            message.error(errorMessage || 'Failed to update leave request.');
        }
    };

    const handleEditCancel = () => {
        setEditModal({ ...editModal, visible: false });
    };

    const handleModify = (record) => {
        showEditModal(record);
    };

    const processRefunds = async () => {
        setLoading(true);
        const { response, errorMessage } = await getLeaveRequests({
            courseCode: filters.courseCode || '',
            leaveDateFrom: filters.leaveDateFrom ? filters.leaveDateFrom.format('YYYY-MM-DD') : '',
            leaveDateTo: filters.leaveDateTo ? filters.leaveDateTo.format('YYYY-MM-DD') : '',
            status: filters.status || '',
            requestedDateFrom: filters.requestedDateFrom ? filters.requestedDateFrom.format('YYYY-MM-DD') : '',
            requestedDateTo: filters.requestedDateTo ? filters.requestedDateTo.format('YYYY-MM-DD') : '',
            decisionDateFrom: filters.decisionDateFrom ? filters.decisionDateFrom.format('YYYY-MM-DD') : '',
            decisionDateTo: filters.decisionDateTo ? filters.decisionDateTo.format('YYYY-MM-DD') : '',
            refundStatus: 'ELIGIBLE',
            page: 0,
            size: 10000,
        });
        if (!response) {
            message.error(errorMessage || 'Failed to load leave requests for refunds.');
            setLoading(false);
            return;
        }
        const items = response.content || response;
        const toRefund = items.filter((i) => i.refundStatus === 'ELIGIBLE');
        if (!toRefund.length) {
            message.info('No eligible refunds found.');
            setLoading(false);
            return;
        }
        const results = await Promise.allSettled(
            toRefund.map((item) =>
                decideLeaveRequest(item.id, 'REFUNDED', { remarks: 'Refund processed', decisionDate: moment().format('YYYY-MM-DD') })
            )
        );
        const successCount = results.filter((r) => r.status === 'fulfilled' && r.value && r.value.response).length;
        const failCount = results.length - successCount;
        if (successCount) message.success(`${successCount} refunds processed.`);
        if (failCount) message.error(`${failCount} refunds failed.`);
        setLoading(false);
        fetchData();
    };

    const columns = [
        { title: 'Leave Date', dataIndex: 'leaveDate', key: 'leaveDate', sorter: (a, b) => new Date(a.leaveDate) - new Date(b.leaveDate) },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Requested Date', dataIndex: 'requestedDate', key: 'requestedDate', sorter: (a, b) => new Date(a.requestedDate || 0) - new Date(b.requestedDate || 0) },
        { title: 'Decision Date', dataIndex: 'decisionDate', key: 'decisionDate', sorter: (a, b) => new Date(a.decisionDate || 0) - new Date(b.decisionDate || 0) },
        { title: 'Reason', dataIndex: 'reason', key: 'reason' },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            render: (text) => text || '',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Button size="small" type="primary" onClick={() => showDecisionModal('approve', record)} style={{ marginRight: 8 }}>
                        Approve
                    </Button>
                    <Button size="small" danger onClick={() => showDecisionModal('reject', record)} style={{ marginRight: 8 }}>
                        Reject
                    </Button>
                    <Button size="small" onClick={() => handleModify(record)}>
                        Modify
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Leave Request Management</h1>
            <Card style={{ marginBottom: 16 }}>
                <Form layout="inline" onFinish={handleSearch}>
                    <Form.Item name="leaveDateRange" label="Leave Date">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select allowClear style={{ width: 120 }}>
                            {Object.values(LeaveStatus).map((status) => (
                                <Option key={status} value={status}>
                                    {status}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="requestedDateRange" label="Requested Date">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item name="decisionDateRange" label="Decision Date">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" onClick={processRefunds} style={{ marginLeft: 8 }} disabled={loading}>
                            Process Refunds
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={pagination} onChange={handleTableChange} />
            <Modal
                visible={modal.visible}
                title={modal.type === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={modal.type === 'approve' ? 'Approve' : 'Reject'}
            >
                <Input.TextArea value={modal.remarks} onChange={(e) => setModal({ ...modal, remarks: e.target.value })} placeholder="Enter remarks" rows={3} style={{ marginBottom: 12 }} />
                <DatePicker value={modal.decisionDate} onChange={(date) => setModal({ ...modal, decisionDate: date })} style={{ width: '100%' }} placeholder={'Select decision date'} />
            </Modal>
            <Modal visible={editModal.visible} title="Modify Leave Request" onOk={handleEditOk} onCancel={handleEditCancel} okText="Save">
                <Form layout="vertical">
                    <Form.Item label="Reason" required>
                        <Input.TextArea value={editModal.reason} onChange={(e) => setEditModal({ ...editModal, reason: e.target.value })} rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LeaveMPage;
