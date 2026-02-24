import { apiCallNoPage } from '../apiService';

export const getEnrollments = async () => apiCallNoPage('/enrollments');
export const createEnrollment = async (enrollmentData) => apiCallNoPage('/enrollments', 'POST', enrollmentData);
export const updateEnrollment = async (id, enrollmentData) => apiCallNoPage(`/enrollments/${id}`, 'PUT', enrollmentData);
export const deleteEnrollment = async (id) => apiCallNoPage(`/enrollments/${id}`, 'DELETE');

// related to Student
export const getStudentsDetailByCourseId = async (courseId) => apiCallNoPage(`/v2/enrollments/courses/${courseId}/studentsDetail`);
export const getStudentsWithEnrollmentsByCourseId = async (courseId) => {
    return await apiCallNoPage(`/v2/enrollments/courses/${courseId}/studentsDetail`);
};
export const getStudentWithEnrollmentByEnrollmentId = async (enrollmentId) => apiCallNoPage(`/v2/enrollments/${enrollmentId}/studentsWithEnrollments`);

export const removeStudentFromCourse = async (courseId, studentId) => apiCallNoPage(`/v2/enrollments/courses/${courseId}/students/${studentId}`, 'DELETE');

export const searchStudentsByStudentCodeNotEnrolled = async (courseId, studentCode) =>
    await apiCallNoPage(`/v0/enrollments/search/findStudentsByStudentCodeNotEnrolled?courseId=${courseId}&studentCode=${studentCode}`);

export const searchStudentsByPhoneNotEnrolled = async (courseId, phone) => await apiCallNoPage(`/v0/enrollments/search/findStudentsByPhoneNotEnrolled?courseId=${courseId}&phoneNumber=${phone}`);

export const searchStudentsByFirstNameNotEnrolled = async (courseId, firstName) =>
    await apiCallNoPage(`/v0/enrollments/search/findStudentsByFirstNameNotEnrolled?courseId=${courseId}&firstName=${firstName}`);

export const addStudentToCourse = async (enrollmentData) => apiCallNoPage(`/v2/enrollments`, 'POST', enrollmentData);

export const findStudentsAndEnrollmentByEnrollmentId = async (enrollmentId) => {
    const { response, errorMessage } = await apiCallNoPage(`/enrollments/${enrollmentId}`);
    if (errorMessage) {
        return { response: null, errorMessage };
    }
    return { response: response, errorMessage };
};

export const updateEnrollmentById = (enrollmentId, details) => apiCallNoPage(`/enrollments/${enrollmentId}`, 'PATCH', details);
