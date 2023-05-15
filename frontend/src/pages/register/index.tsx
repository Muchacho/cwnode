import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Card, Form, Row, Space, Typography } from 'antd';
import { CustomInput } from '../../components/custom-input';
import { PasswordInput } from '../../components/password-input';
import { CustomButton } from '../../components/custom-button';
import { Link, useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { selectUser } from '../../features/auth/authSlice';
import { useRegisterMutation } from '../../app/services/auth';
import { useSelector } from 'react-redux';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { ErrorMessage } from '../../components/error-message';

type RegisterData = {
    email: string;
    password: string;
    confirmPassword: string;
}

export const Register = () =>{
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [error, setError] = useState('');
    const [registerUser] = useRegisterMutation();

    const register = async (data: RegisterData) =>{
        try{
            await registerUser(data).unwrap();
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
                <Card title="Зарегистрируйтесь" style={{width:"30rem"}}>
                    <Form onFinish={register}>
                        <CustomInput type="email" name="email" placeholder="Email"/>
                        <CustomInput type="text" name="firstname" placeholder="Имя"/>
                        <CustomInput type="text" name="lastname" placeholder="Фамилия"/>
                        <PasswordInput name="password" placeholder="Пароль"/>
                        <PasswordInput name="confirmPassword" placeholder="Повторите пароль"/>
                        <CustomButton type="primary" htmlType="submit">
                            Зарегистрироваться
                        </CustomButton>
                    </Form>
                    <Space direction="vertical" size="large">
                        <Typography.Text>
                            Есть аккаунт? <Link to={Paths.login}>Войдите</Link>
                        </Typography.Text>
                        <ErrorMessage message={error}/>
                    </Space>
                </Card>    
            </Row>
        </Layout>
    )
}