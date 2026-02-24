import { Button, message, Select, Table, Typography, Card, Input } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ATTENDANCE_STATUSES } from '~/common/constants/AttendanceStatus';
import { markAttendance, markListAttendances, getAttendaceOfSession } from '~/common/services/apis/attendanceApis';
import { getSessionById } from '~/common/services/apis/educations/classSessionApis';
import { getCourseById } from '~/common/services/apis/courseApis';
import { getStudentsDetailByCourseId } from '~/common/services/apis/enrollmentApis';
import urls from '~/common/configs/urls';

const { Column } = Table;
const { Option } = Select;
const { Title } = Typography;

const AttendancesMPage = () => {
    const { sessionId, courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [session, setSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [remarks, setRemarks] = useState({});
    const navigate = useNavigate();

    const fetchCourseInfo = useCallback(async () => {
        const { response, errorMessage } = await getCourseById(courseId);
        if (response) setCourse(response);
        else message.error('Failed to fetch course: ' + errorMessage);
    }, [courseId]);

    const fetchSessionInfo = useCallback(async () => {
        const { response, errorMessage } = await getSessionById(sessionId);
        if (response) setSession(response);
        else message.error('Failed to fetch session: ' + errorMessage);
    }, [sessionId]);

    const fetchEnrolledStudents = useCallback(async () => {
        const { response, errorMessage } = await getStudentsDetailByCourseId(courseId);
        if (response) setStudents(response);
        else message.error('Failed to fetch students: ' + errorMessage);
    }, [courseId]);

    const fetchAttendances = useCallback(async () => {
        if (!sessionId) return;
        const { response, errorMessage } = await getAttendaceOfSession(sessionId);
        console.log('Fetched attendances:', response);
        if (response) {
            const attendanceMap = {};
            const remarksMap = {};
            response.forEach((a) => {
                attendanceMap[a.studentId] = a.status;
                remarksMap[a.studentId] = a.remarks || '';
            });
            setAttendance((prev) => ({ ...prev, ...attendanceMap }));
            setRemarks((prev) => ({ ...prev, ...remarksMap }));
        } else if (errorMessage) {
            message.error('Failed to fetch attendances: ' + errorMessage);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchCourseInfo();
    }, [fetchCourseInfo]);
    useEffect(() => {
        fetchSessionInfo();
    }, [fetchSessionInfo]);
    useEffect(() => {
        fetchEnrolledStudents();
    }, [fetchEnrolledStudents]);
    useEffect(() => {
        fetchAttendances();
    }, [fetchAttendances]);

    const handleAttendanceChange = useCallback((studentId, status) => {
        setAttendance((prev) => ({ ...prev, [studentId]: status }));
    }, []);

    const handleRemarksChange = useCallback((studentId, value) => {
        setRemarks((prev) => ({ ...prev, [studentId]: value }));
    }, []);

    const handleMarkBulkSubmit = useCallback(async () => {
        const attendanceData = students.map((student) => ({
            studentId: student.studentId,
            classSessionId: sessionId,
            status: attendance[student.studentId] || 'PRESENT',
            remarks: remarks[student.studentId] || '',
        }));
        const { response, errorMessage } = await markListAttendances(sessionId, attendanceData);
        if (response) message.success('Attendance saved successfully!');
        else message.error('Failed to save attendance: ' + errorMessage);
    }, [students, attendance, remarks, sessionId]);

    const handleMarkSingle = useCallback(
        async (student) => {
            const attendanceData = {
                studentId: student.studentId,
                classSessionId: sessionId,
                status: attendance[student.studentId] || 'PRESENT',
                remarks: remarks[student.studentId] || '',
            };
            const { response, errorMessage } = await markAttendance(sessionId, attendanceData);
            if (response) message.success(`Attendance marked for ${student.firstName} ${student.lastName}`);
            else message.error('Failed to mark attendance: ' + errorMessage);
        },
        [attendance, remarks, sessionId],
    );

    return (
        <div style={{ background: '#f5f6fa', minHeight: '100vh', padding: '32px' }}>
            <Card
                style={{
                    maxWidth: 1000,
                    margin: '0 auto',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    borderRadius: 12,
                    padding: 24,
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div style={{ padding: 24 }}>
                    <Title level={2} style={{ marginBottom: 24, textAlign: 'center', color: '#2d3a4b' }}>
                        Mark Attendance for {course ? course.name : 'Course'} - {session ? ` ${session.sessionDate} ` : 'Session'}
                    </Title>
                    <Table
                        dataSource={students}
                        rowKey="studentId"
                        pagination={false}
                        bordered
                        style={{ background: '#fff', borderRadius: 8 }}
                        rowClassName={(_, idx) => (idx % 2 === 0 ? 'even-row' : 'odd-row')}
                    >
                        <Column title="Student Code" dataIndex="studentCode" key="studentCode" />
                        <Column title="First Name" dataIndex="firstName" key="firstName" />
                        <Column title="Last Name" dataIndex="lastName" key="lastName" />
                        <Column
                            title="Attendance"
                            key="attendance"
                            render={(_, record) => (
                                <Select value={attendance[record.studentId] || 'PRESENT'} onChange={(value) => handleAttendanceChange(record.studentId, value)} style={{ width: 120 }}>
                                    {ATTENDANCE_STATUSES.map((status) => (
                                        <Option key={status} value={status}>
                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        />
                        <Column
                            title="Remarks"
                            key="remarks"
                            render={(_, record) => (
                                <Input
                                    key={record.studentId}
                                    name={`remarks-${record.studentId}`}
                                    id={`remarks-${record.studentId}`}
                                    value={remarks[record.studentId] || ''}
                                    onChange={(e) => handleRemarksChange(record.studentId, e.target.value)}
                                    placeholder="Add remarks"
                                    maxLength={100}
                                    style={{ width: 180 }}
                                    autoComplete="off"
                                />
                            )}
                        />
                        <Column
                            title="Action"
                            key="action"
                            render={(_, record) => (
                                <>
                                    <Button type="primary" size="small" onClick={() => handleMarkSingle(record)} style={{ borderRadius: 6, marginRight: 8 }}>
                                        Mark
                                    </Button>
                                    <Button
                                        type="default"
                                        size="small"
                                        style={{ borderRadius: 6 }}
                                        onClick={() =>
                                            navigate(
                                                urls.leaveRequest.replace(':courseId', courseId).replace(':sessionId', sessionId).replace(':studentId', record.studentId) +
                                                    `?leaveDate=${encodeURIComponent(session?.sessionDate || '')}`,
                                            )
                                        }
                                    >
                                        Leave Request
                                    </Button>
                                </>
                            )}
                        />
                    </Table>
                    <div style={{ textAlign: 'right', marginTop: 32 }}>
                        <Button
                            type="primary"
                            onClick={handleMarkBulkSubmit}
                            style={{
                                padding: '0 32px',
                                height: 40,
                                fontWeight: 500,
                                fontSize: 16,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
                            }}
                        >
                            Mark Attendances
                        </Button>
                    </div>
                </div>
            </Card>
            <style>
                {`
                .even-row { background: #fafbfc !important; }
                .odd-row { background: #fff !important; }
                `}
            </style>
        </div>
    );
};

export default AttendancesMPage;
