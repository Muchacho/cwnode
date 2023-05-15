import React from 'react'
import { Card, Form, Space } from 'antd';
import { CustomInput } from '../custom-input';
import { ErrorMessage } from '../error-message';
import { CustomButton } from '../custom-button';
import { Show } from '../../app/services/shows';
import { ScheduleData } from '../../app/services/schedule';

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    schedule?: T
}

export const ScheduleForm = ({onFinish, title, btnText, error, schedule}: Props<ScheduleData>) => {
  return (
    <Card title = { title } style={{ width: '30rem' }}>
        <Form name='schedule-form' onFinish={onFinish} initialValues={ schedule }>
            <CustomInput type='text' name='theater' placeholder='Театр'/>
            <CustomInput type='text' name='area' placeholder='Зал'/>
            <CustomInput type='text' name='price' placeholder='Цена билета(BYN)'/>
            <CustomInput type='text' name='start_time' placeholder='Дата и время (yyyy-mm-dd hh:mm)'/>
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
