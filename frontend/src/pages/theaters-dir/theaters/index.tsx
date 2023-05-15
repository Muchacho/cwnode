import React, { useEffect } from 'react'
import { Layout } from '../../../components/layout'
import { CustomButton } from '../../../components/custom-button'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Descriptions, Table, Typography, Image } from 'antd'
import { Theater, useGetAllTheatersQuery } from '../../../app/services/theaters'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../../paths'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/auth/authSlice'

const columns: ColumnsType<Theater> = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Описание',
        dataIndex: 'description',
        key: 'description'
    }
]

export const Theaters = () => {

    const { data, isLoading } = useGetAllTheatersQuery();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    useEffect(()=> {
        if(!user)navigate(Paths.login);
    }, [navigate, user])

    const goToAddTheaters = () => navigate(Paths.addTheater)

  return (
    <Layout>
            <Typography.Title level={1}>
                Театры
            </Typography.Title>
            {
                user?.role === 'admin' ? (
                <CustomButton type='primary' onClick={ goToAddTheaters } icon = {<PlusCircleOutlined/>}>
                    Добавить
                </CustomButton>
                ) : (<></>)
            }
        <Table
            loading = { isLoading }
            dataSource = { data }
            pagination = { false }
            columns={ columns }
            rowKey={ (record) => record.theater_id }
            onRow={ 
                (record) => {
                    return {
                        onClick: () => {
                            navigate(`${Paths.getFullTheaterInfo}/${record.theater_id}`)
                        }
                    }
                } 
            }
        />
    </Layout>
  )
}
