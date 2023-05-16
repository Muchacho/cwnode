import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Actor, Theater, useEditTheaterMutation, useGetTheaterQuery } from '../../../app/services/theaters';
import { Layout } from '../../../components/layout';
import { Row } from 'antd';
import { TheaterForm } from '../../../components/theaters-from';
import { Paths } from '../../../paths';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { useEditActorMutation, useGetActorQuery } from '../../../app/services/actors';
import { ActorForm } from '../../../components/actors-form';
import jwt from 'jwt-decode'

export const EditActor = () => {

    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);
    
    const params = useParams<{id: string}>();
    const [error, setError] = useState('');
    const {data, isLoading} = useGetActorQuery(params.id || '');
    const [editActor] = useEditActorMutation();

    if(isLoading) return <span>Загрузка</span>

    const handleEditActor = async (actor: Actor) => {
        try{
            const editedActor = {...data, ...actor};

            await editActor(editedActor).unwrap();
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
            <ActorForm
                title='Редактировать театр'
                btnText='Редактировать'
                error={error}
                actor={data}
                onFinish = {handleEditActor}
            />
        </Row>
    </Layout>
  )
}
