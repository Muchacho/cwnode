import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';
import { Layout } from '../../../components/layout';
import { Avatar, Descriptions, Divider, Modal, Space, Table, Typography } from 'antd';
import { CustomButton } from '../../../components/custom-button';
import { DeleteOutlined, EditOutlined, FormOutlined, PlusCircleOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../components/error-message';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { CommentData, FullShowInfo, useGetCommentsQuery, useGetShowQuery, useRemoveShowMutation } from '../../../app/services/shows';
import { ColumnsType } from 'antd/es/table';
import { useGetUserDataQuery, useRemoveUserMutation } from '../../../app/services/users';

export const UserInfo = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data, isLoading} = useGetUserDataQuery();
    const [removeUser] = useRemoveUserMutation();
    // const user = useSelector(selectUser);

    if(isLoading){
        return <span>Загрузка</span>
    }
     
    // if(!data) return <Navigate to='/'/>;
    if(!data) return <span>{data}</span>;
    // else return <span>{data}</span>

    const showModal = ()=>{
        setIsModalOpen(true);
    }
    const hideModal = ()=>{
        setIsModalOpen(false);
    }

    const handleDeleteShow = async () => {
        hideModal();

        try{
            await removeUser().unwrap();
            navigate(`${Paths.login}`);
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }

    const changeAvatar = ()=>{
        alert('qwe');
    }
  return (
    <Layout>
        <Typography.Title level={1}>
                Пользователь
        </Typography.Title>
        <br/>
        {
            data.img_name ? (
                <img className={'avatar'} src={`https://localhost:9000/static/85.jpg`} onClick={changeAvatar}/>
            ) : (
                <Avatar size={64} icon={<UserOutlined />} />
            )
        }
        <br/>
        <br/>
        <Descriptions>
            <Descriptions.Item label='Email' span={3}>
                {data.email }
            </Descriptions.Item>
            <Descriptions.Item label='Имя' span={3}>
                {data.firstname}  
            </Descriptions.Item>
            <Descriptions.Item label='Фамилия' span={3}>
                {data.lastname}
            </Descriptions.Item>
        </Descriptions>
        <Divider orientation='left'>
            Действия
        </Divider>
        <Space>
            <Link to={`${Paths.cart}`}>
                <CustomButton
                    shape='round'
                    type='default'
                    icon={<ShoppingCartOutlined/>} 
                >
                    Корзина
                </CustomButton>
            </Link>
            <Link to={`${Paths.updateUser}`}>
                <CustomButton
                shape='round'
                type='default'
                icon={<EditOutlined/>} 
                >
                    Редактировать
                </CustomButton>
            </Link>
            <Link to={`${Paths.changePassword}`}>
                <CustomButton
                shape='round'
                type='default'
                icon={<EditOutlined/>} 
                >
                    Сменить пароль
                </CustomButton>
            </Link>
            <CustomButton
                    shape='round'
                    danger
                    onClick={showModal}
                    icon={<DeleteOutlined/>} 
                >
                    Удалить
            </CustomButton>
        </Space>
        <ErrorMessage message={ error }/>
        <Modal
            title='Подтвердите удаление'
            open = {isModalOpen}
            onOk = { handleDeleteShow }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Вы действительно хотите удалить аккаунт?
        </Modal>
    </Layout>
  )
}
