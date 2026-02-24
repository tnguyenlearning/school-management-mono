import { AppstoreOutlined, HomeOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import urls from './urls';

export const publicNav = [
    {
        label: 'Home',
        key: urls.home,
        icon: <HomeOutlined />,
    },
    {
        label: 'Register',
        key: urls.register,
        icon: <UserAddOutlined />,
    },
    {
        label: 'Login',
        key: urls.logIn,
        icon: <UserAddOutlined />,
    },
    {
        key: 'alipay',
        label: (
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Navigation Four - Link
            </a>
        ),
    },
];

export const userNav = [
    {
        label: 'Home',
        key: urls.home,
        icon: <HomeOutlined />,
    },
    {
        label: 'Log out',
        key: 'app',
        icon: <AppstoreOutlined />,
        disabled: true,
    },
    {
        label: 'About us',
        key: 'app',
        icon: <AppstoreOutlined />,
        disabled: true,
    },
    
    {
        key: 'alipay',
        label: (
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Navigation Four - Link
            </a>
        ),
    },
];

export const studentManageNav = [
    {
        label: 'Students',
        key: urls.studentsManagement,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Courses',
        key: urls.coursesMaintenance,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Leave',
        key: urls.leavesManagement,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Tuition',
        key: urls.tuitionMaintenance,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Autonumber',
        key: urls.autoNumMaintenance,
        icon: <AppstoreOutlined />,
    },
];
