import React from 'react'
import { Card, Form, Space } from 'antd';
import { CustomInput } from '../custom-input';
import { ErrorMessage } from '../error-message';
import { CustomButton } from '../custom-button';
import { Actor } from '../../app/services/theaters';

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    actor?: T
}

export const ActorForm = ({onFinish, title, btnText, error, actor}: Props<Actor>) => {
  return (
    <Card title = { title } style={{ width: '30rem' }}>
        <Form name='actor-form' onFinish={onFinish} initialValues={ actor }>
            <CustomInput type='text' name='firstname' placeholder='Имя'/>
            <CustomInput type='text' name='lastname' placeholder='Фамилия'/>
            <CustomInput type='text' name='description' placeholder='Описание'/>
            <CustomInput type='text' name='birth_date' placeholder='Дата рождения'/>
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
