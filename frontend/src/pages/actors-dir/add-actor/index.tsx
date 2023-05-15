import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { Row } from 'antd'
import { TheaterForm } from '../../../components/theaters-from'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Actor, Theater, useAddTheaterMutation } from '../../../app/services/theaters'
import { Paths } from '../../../paths'
import { isErrorWithMessage } from '../../../utils/is-error-with-message'
import { selectUser } from '../../../features/auth/authSlice'
import { useAddActorMutation } from '../../../app/services/actors'
import { ActorForm } from '../../../components/actors-form'

export const AddActor = () => {

    const params = useParams<{id: string}>();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addActor] = useAddActorMutation();

    useEffect(()=>{
        if(!user) navigate(Paths.login);
    }, [navigate, user])

    const handleAddActor = async (data: Actor) => {
        try{
            await addActor({
                actors_id: '',
                theater_id: `${params.id}`,
                firstname: data.firstname,
                lastname: data.lastname,
                description: data.description,
                birth_date: data.birth_date,
            }).unwrap();
            navigate(`${Paths.status}/showCreated`);
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
                <ActorForm 
                    title='Добавить актера'
                    btnText='Добавить'
                    onFinish={ handleAddActor }
                    error= { error }
                />
            </Row>
        </Layout>
  )
}
