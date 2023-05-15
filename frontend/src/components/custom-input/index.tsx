import React from 'react';
import {Form, Input} from "antd";

type Props = {
    name: string,
    placeholder: string;
    type?: string;
    onChange?: (values: any) => void | undefined;
}

export const CustomInput = ({
    name,
    placeholder,
    type='text',
    onChange
}: Props) => {
  return (
    <Form.Item
        name={name}
        shouldUpdate = {true}
        rules={[{required: true, message: 'Обязательное поле'}]}
    >
        <Input 
        placeholder={placeholder}
        type={type}
        size='large'
        onChange = {onChange}
        />
    </Form.Item>
  )
}
