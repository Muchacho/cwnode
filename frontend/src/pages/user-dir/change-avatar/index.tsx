import React, { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Theater, useEditTheaterMutation, useGetTheaterQuery } from '../../../app/services/theaters';
import { Layout } from '../../../components/layout';
import { Card, Form, Row } from 'antd';
import { TheaterForm } from '../../../components/theaters-from';
import { Paths } from '../../../paths';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { Show, useEditShowMutation, useGetShowQuery } from '../../../app/services/shows';
import { ShowForm } from '../../../components/shows-form';
import { UserForm } from '../../../components/user-edit-form';
import { User, useChangePasswordMutation, useEditUserMutation, useGetUserDataQuery } from '../../../app/services/users';
import { CustomInput } from '../../../components/custom-input';
import { PasswordInput } from '../../../components/password-input';
import { CustomButton } from '../../../components/custom-button';
import { PlusCircleOutlined } from '@ant-design/icons';

export const ChangeAvatar = () => {
    const navigate = useNavigate();
    // const params = useParams<{id: string}>();
    const [error, setError] = useState('');
    const {data, isLoading} = useGetUserDataQuery();
    const [changePassword] = useChangePasswordMutation();

    if(isLoading) return <span>Загрузка</span>

    if(!data || data === null) return <Navigate to='/'/>

    const doChangePassword = async (data: {password: string}) =>{
        try{
            await changePassword(data).unwrap();
            navigate(Paths.theaters);
        } catch(err){
            const maybeError = isErrorWithMessage(err);
            if(maybeError) setError(err.data.message);
            else setError('Неизвестная ошибка');
        }
    }  
    
    const changeAvatar = async () => {
        try{
            navigate(Paths.theaters);
        } catch(err){
            const maybeError = isErrorWithMessage(err);
            if(maybeError) setError(err.data.message);
            else setError('Неизвестная ошибка');
        }
    }

  return (
    <Layout>
        <Row align="middle" justify="center">
            <Card title="Изменить аватар" style={{width:"30rem"}}>
                <CustomInput type='file' name='img' placeholder='Файл'/>
                <CustomButton type='primary' onClick={ changeAvatar } icon = {<PlusCircleOutlined/>}>
                    Добавить
                </CustomButton>
            </Card>    
        </Row>
    </Layout>
  )
}
