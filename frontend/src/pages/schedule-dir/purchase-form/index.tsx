import React from 'react';
import { Layout } from '../../../components/layout';
import {useState} from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row, Space, Typography } from 'antd';
import { CustomInput } from '../../../components/custom-input';
import { PasswordInput } from '../../../components/password-input';
import { CustomButton } from '../../../components/custom-button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Paths } from '../../../paths';
import { UserData, useLoginMutation } from '../../../app/services/auth';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { ErrorMessage } from '../../../components/error-message';
import { logout } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useBookTicketMutation } from '../../../app/services/schedule';

export const PurchaseForm = () =>{

    let token = localStorage.getItem('token');

    const params = useParams();
    const [idValue, setIdValue] = useState('');
    const [secretValue, setSecretValue] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [error, setError] = useState('');
    const [bookTicket] = useBookTicketMutation();


    const navigate = useNavigate();

    const goToCart = async (data: any) => {
        try{
            if(idValue.length != 19)return setError('Некорректный номер карты');
            if(secretValue.length != 3)return setError('Некорректный CVV');
            let arr = dateValue.split('/');
            if(arr.length != 2 || 
                +arr[0] < 1 ||
                +arr[0] > 12 ||
                (+arr[0] < (new Date().getMonth() + 1) && (+`20${arr[1]}` <= (new Date().getFullYear()))) 
                || (+`20${arr[1]}` < (new Date().getFullYear())))return setError('Некорректная дата');
            setError('');
            let parm = params.id?.split('-');
            if(parm)
            await bookTicket({
                place: parm[0],
                schedule_id: parm[1]
            }).unwrap();
            navigate(Paths.shows);
        } catch(err){
            const maybeError = isErrorWithMessage(err);
            if(maybeError) setError(err.data.message);
            else setError('Неизвестная ошибка');
        }
    }

    return (
        <Layout>
            <Row align="middle" justify="center">
                <Card title="Оплата" style={{width:"30rem"}}>
                   
                    <Form
                        layout="horizontal"
                        onFinish={goToCart}
                        >
                            <Form.Item style={{width:'100%'}}>
                                <Input name='cardId' style={{textAlign:'center'}} value = {idValue} placeholder='XXXX-XXXX-XXXX-XXXX' onChange={(event)=>{
                                    if(event.target.value.length > 19)return;
                                    let arr = event.target.value.split('-');
                                    let res = '';
                                    if(arr.length < 4 && idValue.length < event.target.value.length)
                                    for(let item in arr){
                                        if(arr[item].length%4==0)res+=arr[item]+'-';
                                        else res+=arr[item];
                                    }
                                    else res=event.target.value;
                                    setIdValue(res);
                                }} />
                            </Form.Item>
                            <Space>
                                <Row style={{width:'117%'}} justify="space-between">
                                    <Col span={3}>
                                        <Form.Item>
                                            <Input name="secretKey" style={{textAlign:'center'}} value={secretValue} type='password' placeholder='CVV' onChange={(event)=>{
                                                if(event.target.value.length > 3)return;
                                                setSecretValue(event.target.value);
                                            }}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item>
                                            <Input name='date' style={{textAlign:'center'}} value={dateValue} placeholder='MM/YY ' onChange={(event)=>{
                                                if(event.target.value.length > 5) return;
                                                let arr = event.target.value.split('/');
                                                let res = '';
                                                if(arr.length < 2 && dateValue.length < event.target.value.length)
                                                for(let item in arr){
                                                    if(arr[item].length%2==0)res+=arr[item]+'/';
                                                    else res+=arr[item];
                                                }
                                                else res=event.target.value;
                                                setDateValue(res);
                                            }}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Space>
                            <Button type="primary" htmlType="submit" style={{width:'100%', marginBottom: 25}}>
                                Оплатить
                            </Button>
                            <br/>
                            <ErrorMessage message={error}/>
                        </Form>
                </Card>    
            </Row>
        </Layout>
    )
}


