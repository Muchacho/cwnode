import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout'
import { CustomButton } from '../../components/custom-button'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Descriptions, Table, Typography, Image, Modal } from 'antd'
import { Theater, useGetAllTheatersQuery } from '../../app/services/theaters'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../paths'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/auth/authSlice'
import { useGetCartQuery, useRemoveTicketMutation } from '../../app/services/cart'
import { Ticket } from '../../app/services/cart'
import { isErrorWithMessage } from '../../utils/is-error-with-message'
import jwt from 'jwt-decode'


const columns: ColumnsType<Ticket> = [
    {
        title: 'Представление',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Время',
        dataIndex: 'time',
        key: 'time'
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price'
    },
    {
        title: 'Театр',
        dataIndex: 'theater_name',
        key: 'theater_name'
    },    
    {
        title: 'Место',
        dataIndex: 'place',
        key: 'place'
    }   
]

export const Cart = () => {
    
    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const { data, isLoading } = useGetCartQuery();
    const [removeTicket] = useRemoveTicketMutation();

    const user = useSelector(selectUser);

    useEffect(()=> {
        if(!user)navigate(Paths.login);
    }, [navigate, user])

    
  return (
    <Layout>
            <Typography.Title level={1}>
                Корзина
            </Typography.Title>
            {
                data ? (
                    <Table
                        loading = { isLoading }
                        dataSource = { data }
                        pagination = { false }
                        columns={ columns }
                        rowKey={ (record) => record.ticket_id }
                        onRow={ 
                            (record) => {
                                return {
                                    onClick: () => {
                                        navigate(`${Paths.ticket}/${record.ticket_id}`)
                                    }
                                }
                            } 
                        }
                    />
                ) : (
                    <span>Заказов пока что нет</span>
                )
            }
    </Layout>
  )
}
