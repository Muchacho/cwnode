import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { Paths } from '../../paths';
import { Layout } from '../../components/layout';
import { Descriptions, Divider, Modal, Space, Table, Typography } from 'antd';
import { CustomButton } from '../../components/custom-button';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../components/error-message';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { FullShowInfo, useGetShowQuery, useRemoveShowMutation } from '../../app/services/shows';
import { ColumnsType } from 'antd/es/table';
import jwt from 'jwt-decode'
import { useGetTicketQuery, useRemoveTicketMutation } from '../../app/services/cart';


export const Ticket = () => {
    const params = useParams();
    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data, isLoading} = useGetTicketQuery(params.id || "");
    const [removeTicket] = useRemoveTicketMutation();
    const user = useSelector(selectUser);

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

    const handleDeleteTicket = async () => {
        hideModal();

        try{
            await removeTicket(data.ticket_id).unwrap();
            navigate(`${Paths.status}/showDeleted`);
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }
  return (
    <Layout>
        <Typography.Title level={1}>
                Информация о билете
        </Typography.Title>
        <br/>
        <Descriptions>
            <Descriptions.Item label='Представление' span={3}>
                {data.name}
            </Descriptions.Item>
            <Descriptions.Item label='Дата и время' span={3}>
                {data.time}  
            </Descriptions.Item>
            <Descriptions.Item label='Театр' span={3}>
                {data.theater_name}  
            </Descriptions.Item>
            <Descriptions.Item label='Место' span={3}>
                {data.place}  
            </Descriptions.Item>
            <Descriptions.Item label='Адрес' span={3}>
                {data.address}  
            </Descriptions.Item>
            <Descriptions.Item label='Цена' span={3}>
                {data.price} рублей
            </Descriptions.Item>
            {/* <Descriptions.Item label='Продолжительность' span={3}>
                {data.show.duration} минут
            </Descriptions.Item>
            {
                data.show.rating ? (
                    <Descriptions.Item label='Рейтинг' span={3}>
                        {data.show.rating}
                    </Descriptions.Item>
                ) : (
                    <Descriptions.Item label='Рейтинг' span={3}>
                        Рейтинг отсутствует
                    </Descriptions.Item>
                )
            } */}
        </Descriptions>
            <Divider orientation='left'>
                Действия
            </Divider>
            <Space>
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
            onOk = { handleDeleteTicket }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Вы действительно хотите убрать бронирование билета?
        </Modal>
    </Layout>
  )
}
