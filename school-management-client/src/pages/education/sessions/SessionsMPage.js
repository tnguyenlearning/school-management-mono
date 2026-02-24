import { Button, Select, Table, Modal, Input, message, TimePicker, DatePicker, Pagination, Form, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import urls from '~/common/configs/urls';
import { SessionStatus } from '~/common/constants/SessionStatus';
import { getSessionsByCourseId, updatePatchSession, addManualSession } from '~/common/services/apis/educations/classSessionApis';
import GenerateSessionInline from '~/pages/components/GenerateSessionInline';
import moment from 'moment';
import { getCourseById } from '~/common/services/apis/courseApis';

const { Option } = Select;

const { Title, Text } = Typography;

const SessionsMPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [initialStatuses, setInitialStatuses] = useState({});
    const [statusChanged, setStatusChanged] = useState(false);
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    const [showTimeAdjustmentModal, setShowTimeAdjustmentModal] = useState(false);
    const [showAddSessionModal, setShowAddSessionModal] = useState(false); // State for Add Session modal
    const [currentSession, setCurrentSession] = useState(null);
    const [newRemark, setNewRemark] = useState('');
    const [adjustedStartTime, setAdjustedStartTime] = useState(null);
    const [adjustedEndTime, setAdjustedEndTime] = useState(null);

    const [newSessionDate, setNewSessionDate] = useState(null); // For new session date
    const [newSessionStatus, setNewSessionStatus] = useState(SessionStatus[0]); // Default status
    const [newSessionRemark, setNewSessionRemark] = useState(''); // Remark for new session
    const [newAdjustedStartTime, setNewAdjustedStartTime] = useState(null);
    const [newAdjustedEndTime, setNewAdjustedEndTime] = useState(null);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 }); // Add pagination state
    const today = moment();
    const [filters, setFilters] = useState({
        sessionDateFrom: today.format('YYYY-MM-DD'),
        sessionDateTo: today.clone().add(1, 'month').format('YYYY-MM-DD'),
        status: undefined,
    });
    const [sorter, setSorter] = useState({ field: 'sessionDate', order: null }); // order: 'asc' | 'desc' | null

    const { courseId } = useParams(); // Retrieve session ID and course ID from URL
    const [course, setCourse] = useState(location.state?.course);
    // ...existing code...

    useEffect(() => {
        if (!course) {
            fetchCourseInfo();
        }
    }, [courseId]);

    const fetchCourseInfo = async () => {
        const { response, errorMessage } = await getCourseById(courseId);
        if (response) {
            setCourse(response);
        } else {
            message.error('Failed to fetch course: ' + errorMessage);
        }
    };
    useEffect(() => {
        courseId && fetchSessions(courseId);
        // eslint-disable-next-line
    }, [courseId, filters, sorter]);

    // Updated fetchSessions to accept optional sessionDateFrom, sessionDateTo, and status, and use pagination/sorting
    const fetchSessions = async (
        courseId,
        sessionDateFrom = filters.sessionDateFrom,
        sessionDateTo = filters.sessionDateTo,
        status = filters.status,
        page = pagination.current - 1,
        size = pagination.pageSize,
        sort = sorter.order ? `${sorter.field},${sorter.order}` : undefined,
    ) => {
        // Build params object
        const params = {
            courseId,
            page,
            size,
        };
        if (sort) params.sort = sort;
        if (sessionDateFrom) params.sessionDateFrom = sessionDateFrom;
        if (sessionDateTo) params.sessionDateTo = sessionDateTo;
        if (status) params.status = status;

        // Pass params to getSessionsByCourseId
        const { response, errorMessage } = await getSessionsByCourseId(params);
        if (response && response.content) {
            const updatedSessions = response.content.map((session) => ({
                ...session,
                adjustedStartTime: session.adjustedStartTime ? moment(session.adjustedStartTime, 'HH:mm:ss') : null,
                adjustedEndTime: session.adjustedEndTime ? moment(session.adjustedEndTime, 'HH:mm:ss') : null,
            }));
            setSessions(updatedSessions);
            trackInitialStatuses(updatedSessions);
            setPagination((prev) => ({
                ...prev,
                total: response.totalElements || (response.pageable && response.pageable.totalElements) || 0,
                current: (response.number || 0) + 1,
            }));
        } else {
            message.error(errorMessage || 'Failed to load sessions.');
        }
    };

    const trackInitialStatuses = (sessions) => {
        const statusMap = sessions.reduce((map, session) => {
            map[session.id] = {
                status: session.status,
                remark: session.remark,
                adjustedStartTime: session.adjustedStartTime,
                adjustedEndTime: session.adjustedEndTime,
            };
            return map;
        }, {});
        setInitialStatuses(statusMap);
    };

    const handleAddSession = async () => {
        if (!newSessionDate) {
            message.error('Session date is required.');
            return;
        }

        const newSessionData = {
            sessionDate: newSessionDate.format('YYYY-MM-DD'),
            status: newSessionStatus,
            remark: newSessionRemark,
            adjustedStartTime: newAdjustedStartTime ? newAdjustedStartTime.format('HH:mm:ss') : null, // Convert moment to time string
            adjustedEndTime: newAdjustedEndTime ? newAdjustedEndTime.format('HH:mm:ss') : null, // Convert moment to time string
        };

        const { response, errorMessage } = await addManualSession(courseId, newSessionData);

        if (response) {
            message.success('Session added successfully.');
            fetchSessions(courseId); // Refresh session list
            setShowAddSessionModal(false); // Close modal
        } else {
            message.error(errorMessage || 'Failed to add session.');
        }
    };

    const handleStatusChange = (sessionId, newStatus) => {
        updateSessionState(sessionId, { status: newStatus });
    };

    const handleRemarkChange = (remark) => {
        if (currentSession) {
            updateSessionState(currentSession.id, { remark });
        }
        setShowRemarkModal(false);
    };

    const handleTimeAdjustment = () => {
        if (currentSession) {
            updateSessionState(currentSession.id, {
                adjustedStartTime: moment(adjustedStartTime, 'HH:mm:ss'),
                adjustedEndTime: moment(adjustedEndTime, 'HH:mm:ss'),
            });
        }
        setShowTimeAdjustmentModal(false);
    };

    const updateSessionState = (sessionId, updatedFields) => {
        setSessions((prevSessions) => prevSessions.map((session) => (session.id === sessionId ? { ...session, ...updatedFields } : session)));
        setStatusChanged(true); // Mark the status as changed
    };

    const hasSessionChanged = (sessionId) => {
        const initialSession = initialStatuses[sessionId];
        const currentSession = sessions.find((session) => session.id === sessionId);
        return (
            currentSession.status !== initialSession.status ||
            currentSession.remark !== initialSession.remark ||
            (currentSession.adjustedStartTime && !currentSession.adjustedStartTime.isSame(initialSession.adjustedStartTime)) ||
            (currentSession.adjustedEndTime && !currentSession.adjustedEndTime.isSame(initialSession.adjustedEndTime))
        );
    };

    const handleUpdateSession = async (sessionId) => {
        const session = sessions.find((s) => s.id === sessionId);
        const { response, errorMessage } = await updatePatchSession(sessionId, {
            status: session.status,
            remark: session.remark,
            adjustedStartTime: session.adjustedStartTime?.format('HH:mm:ss'),
            adjustedEndTime: session.adjustedEndTime?.format('HH:mm:ss'),
        });

        if (response) {
            message.success('Session updated successfully.');
            fetchSessions(courseId);
        } else {
            message.error(errorMessage || 'Failed to update session.');
        }
    };

    const handleUpdateAllStatus = async () => {
        const sessionsToUpdate = getSessionsToUpdate();
        if (sessionsToUpdate.length === 0) {
            message.info('No changes detected.');
            return;
        }

        const results = await Promise.all(
            sessionsToUpdate.map(async (session) => {
                const { response, errorMessage } = await updatePatchSession(session.id, {
                    status: session.status,
                    remark: session.remark,
                    adjustedStartTime: session.adjustedStartTime?.format('HH:mm:ss'),
                    adjustedEndTime: session.adjustedEndTime?.format('HH:mm:ss'),
                });
                return { sessionId: session.id, success: !!response, errorMessage };
            }),
        );

        handleUpdateResults(results);
    };

    const getSessionsToUpdate = () => {
        return sessions.filter((session) => {
            const initialSession = initialStatuses[session.id];
            return (
                session.status !== initialSession.status ||
                session.remark !== initialSession.remark ||
                session.adjustedStartTime !== initialSession.adjustedStartTime ||
                session.adjustedEndTime !== initialSession.adjustedEndTime
            );
        });
    };

    const handleUpdateResults = (results) => {
        const successfulUpdates = results.filter((result) => result.success);
        const failedUpdates = results.filter((result) => !result.success);

        if (successfulUpdates.length > 0) message.success(`${successfulUpdates.length} sessions updated successfully.`);
        if (failedUpdates.length > 0) {
            message.error(`${failedUpdates.length} session updates failed.`);
            failedUpdates.forEach(({ sessionId, errorMessage }) => {
                console.error(`Failed to update session ${sessionId}: ${errorMessage}`);
            });
        }

        if (successfulUpdates.length > 0) fetchSessions(courseId);
    };

    const handleResetAllStatus = () => {
        setSessions((prevSessions) =>
            prevSessions.map((session) => ({
                ...session,
                status: initialStatuses[session.id]?.status,
                remark: initialStatuses[session.id]?.remark,
                adjustedStartTime: initialStatuses[session.id]?.adjustedStartTime,
                adjustedEndTime: initialStatuses[session.id]?.adjustedEndTime,
            })),
        );
        setStatusChanged(false);
    };

    const handleNavigation = (action, sessionId = null) => {
        let path = getNavigationPath(action, sessionId);
        navigate(path);
    };

    const getNavigationPath = (action, sessionId) => {
        switch (action) {
            case 'mark-attendance':
                return `/courses/${courseId}/sessions/${sessionId}/attendances`;
        }
    };

    const handleCancel = () => {
        navigate(urls.coursesMaintenance);
    };

    const openRemarkModal = (session) => {
        setCurrentSession(session);
        setNewRemark(session.remark || '');
        setShowRemarkModal(true);
    };

    const openTimeAdjustmentModal = (session) => {
        setCurrentSession(session);
        setAdjustedStartTime(session.adjustedStartTime || null);
        setAdjustedEndTime(session.adjustedEndTime || null);
        setShowTimeAdjustmentModal(true);
    };

    // Filter form submit
    const handleFilterSubmit = (values) => {
        setFilters({
            sessionDateFrom: values.sessionDateRange && values.sessionDateRange[0] ? values.sessionDateRange[0].format('YYYY-MM-DD') : undefined,
            sessionDateTo: values.sessionDateRange && values.sessionDateRange[1] ? values.sessionDateRange[1].format('YYYY-MM-DD') : undefined,
            status: values.status,
        });
        setPagination((prev) => ({ ...prev, current: 1 }));
        setTimeout(
            () =>
                fetchSessions(
                    courseId,
                    values.sessionDateRange && values.sessionDateRange[0] ? values.sessionDateRange[0].format('YYYY-MM-DD') : undefined,
                    values.sessionDateRange && values.sessionDateRange[1] ? values.sessionDateRange[1].format('YYYY-MM-DD') : undefined,
                    values.status,
                    0,
                    pagination.pageSize,
                ),
            0,
        );
    };

    // Table sort handler
    const handleTableChange = (paginationObj, filtersObj, sorterObj) => {
        let order = null;
        if (sorterObj && sorterObj.field === 'sessionDate') {
            if (sorter.order === null) {
                order = 'asc';
            } else if (sorter.order === 'asc') {
                order = 'desc';
            } else {
                order = null;
            }
            setSorter({
                field: 'sessionDate',
                order,
            });
        } else {
            setSorter({ field: 'sessionDate', order: null });
        }
    };

    const columns = [
        {
            title: 'Session Date',
            dataIndex: 'sessionDate',
            sorter: true,
            sortOrder: sorter.field === 'sessionDate' ? (sorter.order === 'asc' ? 'ascend' : sorter.order === 'desc' ? 'descend' : false) : false,
        },
        {
            title: 'Initial Status',
            render: (text, record) => <span>{initialStatuses[record.id]?.status}</span>,
        },
        {
            title: 'Current Status',
            render: (text, record) => (
                <Select value={record.status} onChange={(value) => handleStatusChange(record.id, value)} style={{ width: 150 }}>
                    {SessionStatus.map((status) => (
                        <Option key={status} value={status}>
                            {status}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Remark',
            render: (text, record) => <Button onClick={() => openRemarkModal(record)}>{record.remark ? 'Edit Remark' : 'Add Remark'}</Button>,
        },
        {
            title: 'Time Adjustment',
            render: (text, record) => (
                <Button onClick={() => openTimeAdjustmentModal(record)} disabled={record.status === 'CANCELED'}>
                    Adjust Time
                </Button>
            ),
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Button onClick={() => handleUpdateSession(record.id)} disabled={!hasSessionChanged(record.id)}>
                    Save
                </Button>
            ),
        },

        {
            title: 'Mark',
            render: (text, record) => (
                <Button onClick={() => handleNavigation('mark-attendance', record.id)} disabled={record.status !== 'IN_PROGRESS'}>
                    Make Attendance
                </Button>
            ),
        },
    ];

    // Pagination change handler
    const handlePageChange = (page, pageSize) => {
        setPagination((prev) => ({ ...prev, current: page, pageSize }));
        fetchSessions(courseId, filters.sessionDateFrom, filters.sessionDateTo, filters.status, page - 1, pageSize);
    };

    return (
        <div>
            {/* Course Info & Generate Sessions */}
            {course && (
                <div style={{ marginBottom: 24 }}>
                    <Title level={3}>
                        Course: {course.code} - {course.name}
                    </Title>
                    <div>
                        <Text>Start Date: {course.startDate}</Text> <br />
                        <Text>End Date: {course.endDate || 'Indefinite'}</Text>
                    </div>
                    <GenerateSessionInline course={course} onSuccess={() => fetchSessions(courseId)} />
                </div>
            )}
            {/* Filter Form */}
            <Form layout="inline" onFinish={handleFilterSubmit} style={{ marginBottom: 16 }} initialValues={{ sessionDateRange: [today, today.clone().add(1, 'month')] }}>
                <Form.Item name="sessionDateRange" label="Session Date">
                    <DatePicker.RangePicker defaultValue={[today, today.clone().add(1, 'month')]} />
                </Form.Item>
                <Form.Item name="status" label="Status">
                    <Select allowClear placeholder="Select Status" style={{ width: 150 }}>
                        {SessionStatus.map((status) => (
                            <Option key={status} value={status}>
                                {status}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Filter
                    </Button>
                </Form.Item>
            </Form>
            <Table columns={columns} dataSource={sessions} rowKey="id" pagination={false} onChange={handleTableChange} />
            <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} style={{ marginTop: 16, marginBottom: 16 }} />
            {/* Add Session Button */}
            <Button type="primary" onClick={() => setShowAddSessionModal(true)}>
                Add Session
            </Button>

            {/* Add Session Modal */}
            <Modal
                visible={showAddSessionModal}
                title="Add New Session"
                onCancel={() => setShowAddSessionModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowAddSessionModal(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddSession}>
                        Add Session
                    </Button>,
                ]}
            >
                {/* Session Date */}
                <DatePicker
                    value={newSessionDate}
                    onChange={setNewSessionDate} // Sets the value of newSessionDate state
                    format="YYYY-MM-DD"
                    placeholder="Select Session Date"
                    style={{ width: '100%', marginBottom: 16 }}
                />

                {/* Session Status */}
                <Select
                    value={newSessionStatus}
                    onChange={setNewSessionStatus} // Sets the value of newSessionStatus state
                    style={{ width: '100%', marginBottom: 16 }}
                    placeholder="Select Status"
                >
                    {SessionStatus.map((status) => (
                        <Option key={status} value={status}>
                            {status}
                        </Option>
                    ))}
                </Select>

                {/* Session Remark */}
                <Input.TextArea
                    value={newSessionRemark}
                    onChange={(e) => setNewSessionRemark(e.target.value)} // Sets the value of newSessionRemark state
                    placeholder="Enter Remark"
                    rows={4}
                    style={{ marginBottom: 16 }}
                />

                {/* Adjusted Start Time */}
                <TimePicker value={newAdjustedStartTime} onChange={setNewAdjustedStartTime} format="HH:mm:ss" placeholder="Start Time" style={{ width: '100%', marginBottom: 16 }} />

                {/* Adjusted End Time */}
                <TimePicker
                    value={newAdjustedEndTime}
                    onChange={setNewAdjustedEndTime} // Sets the value of adjustedEndTime state
                    format="HH:mm:ss"
                    placeholder="End Time"
                    style={{ width: '100%' }}
                />
            </Modal>

            {/* Modal for Remark */}
            <Modal
                visible={showRemarkModal}
                title="Remark"
                onCancel={() => setShowRemarkModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowRemarkModal(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleRemarkChange(newRemark)}>
                        Submit
                    </Button>,
                ]}
            >
                <Input.TextArea value={newRemark} onChange={(e) => setNewRemark(e.target.value)} rows={4} placeholder="Enter remark" />
            </Modal>

            {/* Modal for Time Adjustment */}
            <Modal
                visible={showTimeAdjustmentModal}
                title="Adjust Time"
                onCancel={() => setShowTimeAdjustmentModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowTimeAdjustmentModal(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleTimeAdjustment}>
                        Ok
                    </Button>,
                ]}
            >
                <TimePicker value={adjustedStartTime} onChange={setAdjustedStartTime} format="HH:mm:ss" placeholder="Start Time" />
                <TimePicker value={adjustedEndTime} onChange={setAdjustedEndTime} format="HH:mm:ss" placeholder="End Time" />
            </Modal>
        </div>
    );
};

export default SessionsMPage;
