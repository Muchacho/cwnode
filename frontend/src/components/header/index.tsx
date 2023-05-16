import React, { useEffect } from 'react'
import { Layout, Space, Typography } from 'antd';
import {Link, useNavigate} from "react-router-dom";
import styles from './index.module.css'
import { LoginOutlined, LogoutOutlined, ShoppingCartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { CustomButton } from '../custom-button';
import { Paths } from '../../paths';
import { logout, selectUser } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';


export const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const onLogoutClick = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate(Paths.login);
    }

    // useEffect(()=> {
    //     if(!user)navigate(Paths.login);
    // }, [navigate, user])

    // const toUserCart = () =>{
    //     if(user)
    //         navigate(`${Paths.cart}`);
    // };
    const openChat = () => {
        navigate(Paths.chat);
      }
  return (
    <Layout.Header className={styles.header}>
        <Space>
            <Typography.Title level={1}>
                MyTheatry
            </Typography.Title>
        </Space>
        <Space>
            <Link to={Paths.theaters}>
                <CustomButton type='ghost'>
                    Театры
                </CustomButton>
            </Link>
            <Link to={Paths.shows}>
                <CustomButton type='ghost'>
                    Представления
                </CustomButton>
            </Link>
            <Link to={Paths.schedule}>
                <CustomButton type='ghost'>
                    Расписание
                </CustomButton>
            </Link>
        </Space>
        {
            user ? (
                <Space>
                    <CustomButton type="primary" onClick={openChat} > Чат </CustomButton>
                    <CustomButton type='ghost' icon={ <LoginOutlined/>} onClick={ onLogoutClick }>
                        Выйти
                    </CustomButton>
                    <Link to='/api/user'>
                        <CustomButton type='ghost' icon={<UserOutlined/>}>
                            Пользователь
                        </CustomButton>
                    </Link>
                </Space>
            ) : (
                <Space>
                    <Link to={Paths.login}>
                        <CustomButton type="ghost" icon={<UserOutlined/>}>
                                Войти
                        </CustomButton>
                    </Link>
                    <Link to={Paths.register}>
                        <CustomButton type="ghost" icon={<LoginOutlined/>}>
                                Регистрация
                        </CustomButton>
                    </Link>
                </Space>
            )
        }
    </Layout.Header>
  )
}
