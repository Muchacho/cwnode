import React, { useState } from 'react'
import { Theater, useAddTheaterMutation, useEditTheaterMutation } from '../../app/services/theaters';
import { Card, Form, Space } from 'antd';
import { CustomInput } from '../custom-input';
import { ErrorMessage } from '../error-message';
import { CustomButton } from '../custom-button';
import { Paths } from '../../paths';
import { useNavigate } from 'react-router-dom';

type Props<T> = {
    onFinish: (values: T) => void;
    btnText: string;
    title: string;
    error?: string;
    theater?: T
}

export const TheaterForm = ({ onFinish, title, btnText, error, theater }: Props<Theater>) => {
    const [file, setFile] = useState<any>()
    const yyy = (e: any) => {
        setFile(e.target.files[0])
    }
    const onFinishLocal = (e: any) => {

        onFinish({...e, img: file})
    }

    return (
        <Card title={title} style={{ width: '30rem' }}>
            <Form name='theater-form' onFinish={onFinishLocal} initialValues={theater} encType='multipart/form-data'>
                <CustomInput type='text' name='name' placeholder='Название' />
                <CustomInput type='text' name='description' placeholder='Описание' />
                <CustomInput type='text' name='address' placeholder='Адрес' />
                <CustomInput type='file' name='img' placeholder='Файл' onChange={yyy} />
                <Space>
                    <ErrorMessage message={error} />
                    <CustomButton htmlType='submit'>
                        {btnText}
                    </CustomButton>
                </Space>
            </Form>
        </Card>
    )
}
