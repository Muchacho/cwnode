import React, { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Theater, useEditTheaterMutation, useGetTheaterQuery } from '../../../app/services/theaters';
import { Layout } from '../../../components/layout';
import { Row } from 'antd';
import { TheaterForm } from '../../../components/theaters-from';
import { Paths } from '../../../paths';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { Show, useEditShowMutation, useGetShowQuery } from '../../../app/services/shows';
import { ShowForm } from '../../../components/shows-form';
import jwt from 'jwt-decode'


export const EditShow = () => {
    
    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);

    const params = useParams<{id: string}>();
    const [error, setError] = useState('');
    const {data, isLoading} = useGetShowQuery(params.id || '');
    const [editShow] = useEditShowMutation();

    if(isLoading) return <span>Загрузка</span>

    if(!data || data === null) return <Navigate to='/'/>

    const handleEditShow = async (show: Show) => {
        try{
            const editedShow = {...data?.show, ...show};

            await editShow(editedShow).unwrap();
            navigate(`${Paths.status}/showUpdated`);
        } catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');    
        }
    }
  return (
    <Layout>
        <Row align='middle' justify='center'>
            <ShowForm
                title='Редактировать представление'
                btnText='Редактировать'
                error={error}
                show={ data.show }
                onFinish = {handleEditShow}
            />
        </Row>
    </Layout>
  )
}
