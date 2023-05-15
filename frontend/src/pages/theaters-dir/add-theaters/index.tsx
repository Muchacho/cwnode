import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { Row } from 'antd'
import { TheaterForm } from '../../../components/theaters-from'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Theater, useAddTheaterMutation } from '../../../app/services/theaters'
import { Paths } from '../../../paths'
import { isErrorWithMessage } from '../../../utils/is-error-with-message'
import { selectUser } from '../../../features/auth/authSlice'

export const AddTheaters = () => {

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addTheater] = useAddTheaterMutation();

    useEffect(()=>{
        if(!user) navigate(Paths.login);
    }, [navigate, user])

    const requestOptions = (data: any)=>{
        return {
            method: "POST",
            headers: {'authorization': 'Bearer '+ localStorage.getItem('token') },
            body: data
        }
    }

    const handleAddTheater = async (data: Theater) => {
        try{
            
            console.log(data);
            let formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('address', data.address);
            formData.append('img', data.img);
            // await addTheater(data).unwrap();
            const request = await fetch('https://localhost:9000/api/theaters/add', requestOptions(formData));
            navigate(`${Paths.status}/showCreated`);
        } catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else {
                console.log(error);
                setError('Неизвестная ошибка');
            }
        }
    };

    return (
        <Layout>
            <Row align="middle" justify='center'>
                <TheaterForm 
                    title='Добавить театр'
                    btnText='Добавить'
                    onFinish={ handleAddTheater }
                    error= { error }
                />
            </Row>
        </Layout>
  )
}
