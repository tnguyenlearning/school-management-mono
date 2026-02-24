import { apiCallNoPage } from '~/common/services/apiService';

export const getStudents = async (page = 0, size = 10) => await apiCallNoPage(`/v0/students?page=${page}&size=${size}`);

export const getStudentById = async (studentId) => apiCallNoPage(`/v0/students/${studentId}`);

export const getStudentByStudentCode = async (studentCode) => await apiCallNoPage(`/v0/students/search/findByStudentCodeContaining?studentCode=${studentCode}`);

export const getStudentByPhone = async (phone) => await apiCallNoPage(`/v0/students/search/findByPhoneNumberContaining?phone=${phone}`);

export const getStudentByFirstName = async (firstName) => await apiCallNoPage(`/v0/students/search/findByFirstNameContaining?firstName=${firstName}`);

export const getStudentEnrollment = async (studentId) => apiCallNoPage(`/v0/students/${studentId}/enrollments`);

export const createStudent = async (studentData) => apiCallNoPage('/v2/students', 'POST', studentData);
export const updateStudent = async (id, studentData) => apiCallNoPage(`/v0/students/${id}`, 'PUT', studentData);
export const deleteStudent = async (id) => apiCallNoPage(`/v0/students/${id}`, 'DELETE');
