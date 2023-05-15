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

export const EditUser = () => {
    const navigate = useNavigate();
    // const params = useParams<{id: string}>();
    const [error, setError] = useState('');
    const {data, isLoading} = useGetUserDataQuery();
    const [editUser] = useEditUserMutation();

    if(isLoading) return <span>Загрузка</span>

    if(!data || data === null) return <Navigate to='/'/>

    const handleEditUser = async (user: User) => {
        try{
            const editedUser = {...data, ...user};

            await editUser(editedUser).unwrap();
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
