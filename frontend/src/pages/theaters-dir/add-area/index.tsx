import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { Card, Form, Row } from 'antd'
import { TheaterForm } from '../../../components/theaters-from'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Theater, useAddAreaMutation, useAddTheaterMutation } from '../../../app/services/theaters'
import { Paths } from '../../../paths'
import { isErrorWithMessage } from '../../../utils/is-error-with-message'
import { selectUser } from '../../../features/auth/authSlice'
import { CustomInput } from '../../../components/custom-input'
import { CustomButton } from '../../../components/custom-button'
import jwt from 'jwt-decode'


export const AddArea = () => {

    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) decodeToken = {...jwt(token)}
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);

    const params = useParams();
    const [error, setError] = useState("");
    const user = useSelector(selectUser);
    const [addArea] = useAddAreaMutation();

    useEffect(()=>{
        if(!user) navigate(Paths.login);
    }, [navigate, user])

    const handleAddArea = async (data: {num: string, capacity:string}) => {
        try{
            await addArea({
                theater_id: `${params.id}`,
                num: data.num,
                capacity: data.capacity
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
            <Row align="middle" justify="center">
                <Card title="Добавить зал" style={{width:"30rem"}}>
                    <Form onFinish={handleAddArea}>
                        <CustomInput type='text' name='num' placeholder='Номер'/>
                        <CustomInput type='text' name='capacity' placeholder='Вместимость'/>
                        <CustomButton type="primary" htmlType="submit">
                            Изменить
                        </CustomButton>
                    </Form>
                </Card>    
            </Row>
        </Layout>
  )
}
