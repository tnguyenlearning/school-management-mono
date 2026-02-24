import Home from '../../pages/common/Home';
import Register from '../../pages/common/Register';
import Login from '../../pages/common/Login';
import Logout from '../../pages/common/Logout';
import Profile from '../../pages/common/Profile';
import urls from './urls';
import SpecialLayout from '../../layouts/SpecialLayout';
import Special from '../../pages/common/Special';
import networkErr from '~/pages/common/NetworkErr';
import StudentForm from '~/pages/education/students/StudentForm';
import StudentsMPage from '~/pages/education/students/StudentsMPage';
import CoursesMPage from '~/pages/education/courses/CoursesMPage';
import CourseForm from '~/pages/education/courses/CourseForm';
import AttendancesMPage from '~/pages/education/attendance/AttendancesMPage ';
import CourseStudentsMPage from '~/pages/education/courseStudents/CourseStudentsMPage';
import EligibleStudentsEnrollPage from '~/pages/education/enrollment/EligibleStudentsEnrollPage';
import BillingsMPage from '~/pages/billing/billings/BillingsMPage';
import GenerateBillingPage from '~/pages/billing/billings/GenerateBillingPage';
import AutoNumMPage from '~/pages/autonum/AutoNumMPage';
import GenerateAutoNumPage from '~/pages/autonum/GenerateAutoNumPage';
import ReclaimAutoNumPage from '~/pages/autonum/ReclaimAutoNumPage';
import EnrollStudentToCoursePage from '~/pages/education/enrollment/EnrollStudentToCoursePage';
import BillingsEnquiryPage from '~/pages/billing/billings/BillingsEnquiryPage';
import FrequencyOptMPage from '~/pages/billing/billings/FrequencyOptMPage';
import FrequencyOptForm from '~/pages/billing/billings/FrequencyOptForm';
import ManageEnrollmentPage from '~/pages/education/enrollment/ManageEnrollmentPage';
import InvoicesEnquiryPage from '~/pages/billing/billings/InvoicesEnquiryPage';
import StudentAccountForm from '~/pages/billing/studentAccount/StudentAccountForm';

import StudentAccountMPage from '~/pages/billing/studentAccount/StudentAccountMPage';
import BalanceDetailsPage from '~/pages/billing/studentAccount/BalanceDetailsPage';
import ReceiptForm from '~/pages/billing/receipts/ReceiptForm';
import CollectionPage from '~/pages/billing/billings/CollectionPage';
import LeaveMPage from '~/pages/education/leave/LeaveMPage';
import LeaveRequestPage from '~/pages/education/leave/LeaveRequestPage';
import ReceiptMPage from '~/pages/billing/receipts/ReceiptMPage';
import SessionsMPage from '~/pages/education/sessions/SessionsMPage';

const publicRoutes = [
    { path: urls.home, component: Home },
    { path: urls.register, component: Register },
    { path: urls.logIn, component: Login },
    { path: urls.logOut, component: Logout },
    { path: urls.profile, component: Profile },
    { path: urls.networkErr, component: networkErr },
    { path: urls.special, component: Special, layout: SpecialLayout },
    { path: urls.studentsManagement, component: StudentsMPage },
    { path: urls.studentForm, component: StudentForm },
    { path: urls.coursesMaintenance, component: CoursesMPage },
    { path: urls.courseForm, component: CourseForm },
    { path: urls.manageSession, component: SessionsMPage },
    { path: urls.AttendancesMPage, component: AttendancesMPage },
    { path: urls.courseStudentManage, component: CourseStudentsMPage },
    { path: urls.studentEnroll, component: EligibleStudentsEnrollPage },
    { path: urls.enrollStudent, component: EnrollStudentToCoursePage },
    { path: urls.manageEnrollment, component: ManageEnrollmentPage },

    { path: urls.tuitionMaintenance, component: BillingsMPage },
    { path: urls.billingCycle, component: GenerateBillingPage },
    { path: urls.collection, component: CollectionPage },
    { path: urls.autoNumMaintenance, component: AutoNumMPage },
    { path: urls.generateAutoNum, component: GenerateAutoNumPage },
    { path: urls.reclaimAutoNum, component: ReclaimAutoNumPage },
    { path: urls.enquiryBillings, component: BillingsEnquiryPage },
    { path: urls.enquiryInvoices, component: InvoicesEnquiryPage },

    { path: urls.frequencyOptions, component: FrequencyOptMPage },
    { path: urls.FrequencyOptForm, component: FrequencyOptForm },

    { path: urls.studentAccountManagement, component: StudentAccountMPage },
    { path: urls.studentAccountForm, component: StudentAccountForm },

    { path: urls.receiptManagement, component: ReceiptMPage },
    { path: urls.receiptForm, component: ReceiptForm },

    { path: urls.balanceDetails, component: BalanceDetailsPage },

    { path: urls.leavesManagement, component: LeaveMPage },
    { path: urls.leaveRequest, component: LeaveRequestPage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
