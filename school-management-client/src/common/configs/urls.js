import { generateAutoNum, reclaimAutoNum } from '../services/apis/autonumApis';

export const baseURL = 'http://localhost:8080/api';

const urls = {
    home: '/',
    register: '/auth/register',
    logIn: '/auth/login',
    logOut: '/auth/logout',
    profile: '/profile',
    signOut: '/sign-out',
    stats: '/stats',
    special: '/special',
    networkErr: '/network-error',
    studentsManagement: '/students-maintenance',
    studentForm: '/students/form/:action/:studentId?',
    baseStudentForm: '/students/form',

    getCourses: '/courses',

    coursesMaintenance: '/courses-maintenance',
    courseForm: '/courses/form/:action/:courseId?',
    baseCourseForm: '/courses/form',
    courseStudentManage: '/courses/:courseId?/manage-student-incourse',
    addStudentsToCourse: '/courses/:courseId?/add-student',

    studentEnroll: '/course/:courseId/student-enroll',
    enrollStudent: '/course/:courseId/enroll-student/:studentId',
    manageEnrollment: '/course/:courseId/student/:studentId/enrollment/:enrollmentId/manage',

    leavesManagement: '/leave-management',
    leaveForm: '/leave/form/:action/:leaveId?',
    baseLeaveForm: '/leave/form',
    leaveRequest: '/courses/:courseId/sessions/:sessionId/students/:studentId/leave-request',

    manageSession: '/courses/:courseId?/sessions/manage',
    AttendancesMPage: '/courses/:courseId/sessions/:sessionId/attendances',

    tuitionMaintenance: '/tuitions-maintenance',
    billingCycle: '/billing-cycle',
    collection: '/collection',
    invoice: '/invoice',
    receipt: '/receipt',
    payment: '/payment',
    tuitionReports: '/tuition-reports',
    feeAdjustment: '/fee-adjustment',
    feeAdjustmentForm: '/fee-adjustment/form',
    feeAdjustmentFormWithId: '/fee-adjustment/form/:id',
    feeAdjustmentFormWithAction: '/fee-adjustment/form/:action/:id?',
    feeAdjustmentFormWithActionId: '/fee-adjustment/form/:action/:id',
    enquiryBillings: '/enquiry-billings',
    enquiryInvoices: '/enquiry-invoices',

    frequencyOptions: '/frequency-options',

    FrequencyOptForm: '/frequency-options/form/:action/:id?',
    baseFrequencyOptForm: '/frequency-options/form',

    autoNumMaintenance: '/autonum-maintenance',
    generateAutoNum: '/autonum/generate',

    studentAccountManagement: '/student-account-maintenance',
    studentAccountForm: '/student-accounts/form/:action/:studentCode?',
    baseStudentAccountForm: '/student-accounts/form',

    receiptManagement: '/receipt',
    receiptForm: '/receipt/form/:action/:studentCode?',
    baseReceiptForm: '/receipt/form',

    balanceDetails: '/balance-details/:studentCode?',
    baseBalanceDetails: '/balance-details',
};

export default urls;
