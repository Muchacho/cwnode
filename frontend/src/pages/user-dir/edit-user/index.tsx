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
import { UserForm } from '../../../components/user-edit-form';
import { User, useEditUserMutation, useGetUserDataQuery } from '../../../app/services/users';
import jwt from 'jwt-decode'


export const EditUser = () => {
    let token = localStorage.getItem('token');
    let decodeToken = {role: 'non auth', id: -1};
    if(token) {
        decodeToken = {...jwt(token)}
        console.log(decodeToken)
        }
    const navigate = useNavigate();
    if(decodeToken.role == 'non auth') navigate(Paths.login);
    // const params = useParams<{id: string}>();
    const [error, setError] = useState('');
    const {data, isLoading} = useGetUserDataQuery();
    const [editUser] = useEditUserMutation();

    if(isLoading) return <span>Загрузка</span>

    if(!data || data === null) return <Navigate to='/'/>

    const handleEditUser = async (data: User) => {
        try{
            let formData = new FormData();
            formData.append('firstname', data.firstname);
            formData.append('lastname', data.lastname);
            formData.append('img', data.img);
            // const editedUser = {...data, ...user};

            await editUser(formData).unwrap();
            navigate(`${Paths.user}`);
        } catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');    
        }
    }
  return (
    <Layout>
        <Row align='middle' justify='center'>
            <UserForm
                title='Редактировать пользователя'
                btnText='Редактировать'
                error={error}
                user={ data }
                onFinish = {handleEditUser}
            />
        </Row>
    </Layout>
  )
}
