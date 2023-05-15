import React from 'react'
import { Card, Form, Space } from 'antd';
import { CustomInput } from '../custom-input';
import { ErrorMessage } from '../error-message';
import { CustomButton } from '../custom-button';
import { CommentData, Show } from '../../app/services/shows';

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    show?: T
}

export const CommentsForm = ({onFinish, title, btnText, error}: Props<CommentData>) => {
  return (
    <Card title = { title } style={{ width: '30rem' }}>
        <Form name='comments-form' onFinish={onFinish}>
            <CustomInput type='text' name='rating' placeholder='Рейтинг(от 1 до 5)'/>
            <CustomInput type='text' name='comment' placeholder='Текст комментария'/>
            <Space>
                <CustomButton htmlType='submit'>
                    {btnText}
                </CustomButton>
            </Space>
            <ErrorMessage message={ error }/>
        </Form>
    </Card>
  )
}
