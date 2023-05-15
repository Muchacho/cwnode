import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Paths } from '../../../paths'
import { isErrorWithMessage } from '../../../utils/is-error-with-message'
import { selectUser } from '../../../features/auth/authSlice'
import { Show, useAddShowMutation } from '../../../app/services/shows'
import { ShowForm } from '../../../components/shows-form'

export const AddShows = () => {

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addShow] = useAddShowMutation();

    useEffect(()=>{
        if(!user) navigate(Paths.login);
    }, [navigate, user])

    const handleAddShow = async (data: Show) => {
        try{
            await addShow(data).unwrap();
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
                <ShowForm 
                    title='Добавить представление'
                    btnText='Добавить'
                    onFinish={ handleAddShow }
                    error= { error }
                />
            </Row>
        </Layout>
  )
}
