import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Theater, useEditTheaterMutation, useGetTheaterQuery } from '../../../app/services/theaters';
import { Layout } from '../../../components/layout';
import { Row } from 'antd';
import { TheaterForm } from '../../../components/theaters-from';
import { Paths } from '../../../paths';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import jwt from 'jwt-decode'



export const EditTheater = () => {

    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);

    const params = useParams<{id: string}>();
    const [error, setError] = useState('');
    const {data, isLoading} = useGetTheaterQuery(params.id || '');
    const [editTheater] = useEditTheaterMutation();

    if(isLoading) return <span>Загрузка</span>

    const handleEditTheater = async (theater: Theater) => {
        try{
            const editedTheater = {...data, ...theater};

            await editTheater(editedTheater).unwrap();
            navigate(`${Paths.status}/theaterUpdated`);
        } catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');    
        }
    }
  return (
    <Layout>
        <Row align='middle' justify='center'>
            <TheaterForm
                title='Редактировать театр'
                btnText='Редактировать'
                error={error}
                theater={data}
                onFinish = {handleEditTheater}
            />
        </Row>
    </Layout>
  )
}
