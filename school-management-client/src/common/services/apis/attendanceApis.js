import { apiCallNoPage } from '../apiService';

export const markAttendance = (sessionId, attendanceData) => apiCallNoPage(`/v2/attendances/sessions/${sessionId}/mark`, 'POST', attendanceData);

export const markListAttendances = (sessionId, attendancesData) => apiCallNoPage(`/v2/attendances/sessions/${sessionId}/mark-bulk`, 'POST', attendancesData);

export const getAttendaceOfSession = async (sessionId) => await apiCallNoPage(`/v0/class-session/${sessionId}/attendances`, 'GET');
