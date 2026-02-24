import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicNav, studentManageNav, userNav } from '../common/configs/navs';
import { useSelector } from 'react-redux';

function Header() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('mail');
    const [navType, setNavType] = useState(publicNav.concat(studentManageNav));
    const [isUserRole, setIsUserRole] = useState(false);
    const [isAdminRole, setIsAdminRole] = useState(false);

    const { authUser: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser) {
            currentUser.roles.forEach((role) => {
                console.log(role.name.includes('USER'));
                setIsUserRole(role.name.includes('USER'));
                setIsAdminRole(role.name.includes('ADMIN'));

                if (isUserRole) {
                    console.log('isUserRole');
                    setNavType(userNav);
                }
            });
        } else {
            setIsUserRole(false);
            setIsAdminRole(false);
        }
    }, [currentUser, userNav]);

    const onClick = (e) => {
        setCurrent(e.key);
        navigate(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={navType} />;
}
export default Header;
