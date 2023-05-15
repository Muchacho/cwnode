import React from 'react'
import { Card, Form, Space } from 'antd';
import { CustomInput } from '../custom-input';
import { ErrorMessage } from '../error-message';
import { CustomButton } from '../custom-button';
import { Show } from '../../app/services/shows';
import { User } from '../../app/services/users';

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    user?: T
}

export const UserForm = ({onFinish, title, btnText, error, user}: Props<User>) => {
  return (
    <Card title = { title } style={{ width: '30rem' }}>
        <Form name='user-form' onFinish={onFinish} initialValues={ user }>
            <CustomInput type='text' name='firstname' placeholder='Имя'/>
            <CustomInput type='text' name='lastname' placeholder='Фамилия'/>
            <Space>
                <ErrorMessage message={ error }/>
                <CustomButton htmlType='submit'>
                    {btnText}
                </CustomButton>
            </Space>
        </Form>
    </Card>
  )
}
