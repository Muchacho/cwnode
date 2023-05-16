import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { Row, Table, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Paths } from '../../../paths'
import { isErrorWithMessage } from '../../../utils/is-error-with-message'
import { selectUser } from '../../../features/auth/authSlice'
import { CommentData, Show, useAddCommentMutation, useAddShowMutation } from '../../../app/services/shows'
import { ShowForm } from '../../../components/shows-form'
import { CommentsForm } from '../../../components/comments-form'
import { ScheduleForm } from '../../../components/schedule-form'
import { ScheduleData, useAddScheduleItemMutation } from '../../../app/services/schedule'
import { Theater, useGetAllTheatersQuery, useGetTheatersWithAreasQuery } from '../../../app/services/theaters'
import { ColumnsType } from 'antd/es/table'
import jwt from 'jwt-decode'



const columns: ColumnsType<{name:string, areas: string}> = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Залы',
        dataIndex: 'areas',
        key: 'areas'
    },
    
]

export const AddScheduleItem = () => {

    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);

    const params = useParams();
    const [error, setError] = useState("");
    const user = useSelector(selectUser);
    const [addScheduleItem] = useAddScheduleItemMutation();
    const { data, isLoading } = useGetTheatersWithAreasQuery();

    useEffect(()=>{
        if(!user) navigate(Paths.login);
    }, [navigate, user])

    const handleAddSchedule = async (data: ScheduleData) => {
        try{
            data.show_id = `${params.id}`
            await addScheduleItem(data).unwrap();
            navigate(`${Paths.status}/created`);
        } catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else {
                setError('Неизвестная ошибка');
            }
        }
    };

    return (
        <Layout>
            <Row align="middle" justify='center'>
                <ScheduleForm 
                    title='Добавить в расписание'
                    btnText='Добавить'
                    onFinish={ handleAddSchedule }
                    error= { error }
                />
            </Row>
            <br/>
            <Typography.Title level={1}>
                Театры
            </Typography.Title>
            <Table
            loading = { isLoading }
            dataSource = { data }
            pagination = { false }
            columns={ columns }
            />
        </Layout>
  )
}
