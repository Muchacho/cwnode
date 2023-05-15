import React, { useEffect } from 'react'
import { Layout } from '../../../components/layout'
import { CustomButton } from '../../../components/custom-button'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Table, Typography } from 'antd'
// import { Theater, useGetAllTheatersQuery } from '../../app/services/theaters'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../../paths'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/auth/authSlice'
import { Show, useGetAllShowsQuery } from '../../../app/services/shows'

const columns: ColumnsType<Show> = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Описание',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: 'Продолжительность',
        dataIndex: 'duration',
        key: 'description'
    }
]

export const Shows = () => {

    const { data, isLoading } = useGetAllShowsQuery();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    useEffect(()=> {
        if(!user)navigate(Paths.login);
    }, [navigate, user])

    const goToAddShow = () => navigate(Paths.addShow)

  return (
    <Layout>
        <Typography.Title level={1}>
                Представление
        </Typography.Title>
        {
                user?.role === 'admin' ? (
                <CustomButton type='primary' onClick={ goToAddShow } icon = {<PlusCircleOutlined/>}>
                    Добавить
                </CustomButton>
                ) : (<></>)
        }
        <Table
            loading = { isLoading }
            dataSource = { data }
            pagination = { false }
            columns={ columns }
            rowKey={ (record) => record.show_id }
            onRow={ 
                (record) => {
                    return {
                        onClick: () => {
                            navigate(`${Paths.show}/${record.show_id}`)
                        }
                    }
                } 
            }
        />
    </Layout>
  )
}
