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
import jwt from 'jwt-decode'

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

    let token = localStorage.getItem('token');
    const { data, isLoading } = useGetAllTheatersQuery();
    const navigate = useNavigate();
    // const user = useSelector(selectUser);
    let tokenDecode = {id: -1, role: 'non auth'}
    useEffect(()=> {
        // if(!user)navigate(Paths.login);
        if(token) tokenDecode = {...jwt(token)};
        // if(tokenDecode.role == 'non auth') navigate(Paths.login);

    }, [navigate, token])

    const goToAddTheaters = () => navigate(Paths.addTheater)

    const addButton = () => {
        if(token) tokenDecode = {...jwt(token)};
        console.log(tokenDecode);
        if(tokenDecode && tokenDecode?.role == 'admin') {
            return (
                <CustomButton type='primary' onClick={ goToAddTheaters } icon = {<PlusCircleOutlined/>}>
                    Добавить
                </CustomButton>)
        }
        return (<></>)
    }

  return (
    <Layout>
            <Typography.Title level={1}>
                Театры
            </Typography.Title>
            {
                addButton()
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
