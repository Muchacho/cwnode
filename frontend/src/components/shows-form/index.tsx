import React from 'react'
import { Card, Form, Space } from 'antd';
import { CustomInput } from '../custom-input';
import { ErrorMessage } from '../error-message';
import { CustomButton } from '../custom-button';
import { Show } from '../../app/services/shows';

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    show?: T
}

export const ShowForm = ({onFinish, title, btnText, error, show}: Props<Show>) => {
  return (
    <Card title = { title } style={{ width: '30rem' }}>
        <Form name='show-form' onFinish={onFinish} initialValues={ show }>
            <CustomInput type='text' name='name' placeholder='Название'/>
            <CustomInput type='text' name='description' placeholder='Описание'/>
            <CustomInput type='text' name='duration' placeholder='Продолжительность'/>
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
