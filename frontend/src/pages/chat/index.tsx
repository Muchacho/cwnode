import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout'
import { Row, Space } from 'antd'
import { TheaterForm } from '../../components/theaters-from'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Actor, Theater, useAddTheaterMutation } from '../../app/services/theaters'
import { Paths } from '../../paths'
import { isErrorWithMessage } from '../../utils/is-error-with-message'
import { selectUser } from '../../features/auth/authSlice'
import { useAddActorMutation } from '../../app/services/actors'
import { ActorForm } from '../../components/actors-form'
import jwt from 'jwt-decode'
import io from "socket.io-client";
import { CustomInput } from '../../components/custom-input'
import { CustomButton } from '../../components/custom-button'
import { getUserData } from '../../app/services/users'

let token = localStorage.getItem('token');
    let socket:any = undefined;
    if(token){
        socket = io("https://localhost:9000");
    }

export const Chat = () => {

    const navigate = useNavigate();

    const [room, setRoom] = useState("");

    const joinRoom = () => {
        if (room !== "") {
          socket.emit("join_room", room);
        }
      };
    

    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState([{ message: '123', room: '1' }]);


    const sendMessage = () => {
        if(!socket)navigate(Paths.login);
        socket.emit("send_message", {message, room});
      };
    
    const checkMessData = (data: any) => {
      console.log('check data: ', data);
      return data;
    }

    useEffect(() => {
    socket.on("receive_message", (data:{message:string, room: string}) => {
      // console.log(messageReceived);
      // console.log(messageReceived[messageReceived.length-1].message, data.message, 999);
      let arr = messageReceived;

        if(messageReceived[messageReceived.length-1].message != data.message){
          arr.push(data)
        }
        // setMessageReceived(arr => [...arr, data]);
        setMessageReceived(arr);
        console.log(messageReceived, 123123);
    });
    }, [socket]);

    // const getData = () => {
    //   let result += '';
    //   for(let elem in messageReceived){
    //     result
    //   }
    //   return (
    //     <></>
    //   )
    // }
    return (
        <Layout>
            <Row align="middle" justify='center'>
                    <CustomInput type='text' placeholder='Сообщение' name='message' onChange={(event) =>{setMessage(event.target.value);}}/>
                    <br/>
                    <CustomButton type='default' onClick={sendMessage}>Отправить</CustomButton>
            </Row>
            <Row>
                    <CustomInput type='text' placeholder='Пользователь' name='room' onChange={(event) => {setRoom(event.target.value);}}/>
                    <br/>
                    <CustomButton type='default' onClick={joinRoom}>Отправить</CustomButton>
            </Row>
            <Row id='test' align="middle" justify='center'> 
                {messageReceived.map(data => (<div>{ data.message }</div>))}
            </Row>
            
        </Layout>
  )
}
