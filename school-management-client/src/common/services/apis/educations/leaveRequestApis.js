import { apiCallNoPage, apiCallV0WithPage } from '../../apiService';

// Get leave requests with pagination and params
export const getLeaveRequests = async ({ leaveDateFrom, leaveDateTo, status, refundType, refundStatus, requestedDateFrom, requestedDateTo, decisionDateFrom, decisionDateTo, page = 0, size = 10 }) => {
    const params = [
        leaveDateFrom ? `leaveDateFrom=${leaveDateFrom}` : '',
        leaveDateTo ? `leaveDateTo=${leaveDateTo}` : '',
        status ? `status=${status}` : '',
        refundType ? `refundType=${refundType}` : '',
        refundStatus ? `refundStatus=${refundStatus}` : '',
        requestedDateFrom ? `requestedDateFrom=${requestedDateFrom}` : '',
        requestedDateTo ? `requestedDateTo=${requestedDateTo}` : '',
        decisionDateFrom ? `decisionDateFrom=${decisionDateFrom}` : '',
        decisionDateTo ? `decisionDateTo=${decisionDateTo}` : '',
        `page=${page}`,
        `size=${size}`,
    ]
        .filter(Boolean)
        .join('&');
    return await apiCallV0WithPage(`/v0/leave-requests/search/findLeaveRequestsByFilters?${params}`, 'GET');
};

// Create a leave request
export const createLeaveRequest = async (leaveData) => {
    return await apiCallNoPage('/v0/leave-requests', 'POST', leaveData);
};

// Approve or reject a leave request with remarks and date
export const decideLeaveRequest = async (id, status, { remarks, decisionDate }) => {
    // status should be 'APPROVED' or 'REJECTED'
    // use unified decisionDate field
    const body = { status, remarks };
    if (decisionDate) body.decisionDate = decisionDate;
    return await apiCallNoPage(`/v0/leave-requests/${id}`, 'PATCH', body);
};

export const updateLeaveRequest = async (id, { requestedDate, reason, remarks }) => {
    return await apiCallNoPage(`/v0/leave-requests/${id}`, 'PATCH', { requestedDate, reason, remarks });
};

// Delete a leave request by id
export const deleteLeaveRequest = async (id) => {
    return await apiCallNoPage(`/v0/leave-requests/${id}`, 'DELETE');
};

// Get a leave request by sessionId and studentId (single result)
export const getLeaveRequestBySessionStudent = async (sessionId, studentId) => {
    const params = `sessionId=${sessionId}&studentId=${studentId}`;
    return await apiCallNoPage(`/v0/leave-requests/search/by-session-student?${params}`, 'GET');
};
