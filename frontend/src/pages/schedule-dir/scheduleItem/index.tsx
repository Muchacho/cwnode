import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';
import { Layout } from '../../../components/layout';
import { Descriptions, Divider, Modal, Space, Table, Typography } from 'antd';
import { CustomButton } from '../../../components/custom-button';
import { CodeSandboxCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../components/error-message';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { FullShowInfo, useGetShowQuery, useRemoveShowMutation } from '../../../app/services/shows';
import { ColumnsType } from 'antd/es/table';
import { useBookTicketMutation, useGetBookedTicketsQuery, useGetScheduleItemQuery, useRemoveScheduleItemMutation } from '../../../app/services/schedule';

// const columns: ColumnsType<['schedule'][0]> = [
//     {
//         title: 'Цена билета',
//         dataIndex: 'price',
//         key: 'price'
//     },
//     {
//         title: 'Театр',
//         dataIndex: 'name',
//         key: 'name'
//     },
//     {
//         title: 'Время',
//         dataIndex: 'start_time',
//         key: 'start_time'
//     }
// ]

export const ScheduleItem = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data, isLoading} = useGetScheduleItemQuery(params.id || "");
    const [bookTicket] = useBookTicketMutation();
    const [removeScheduleItem] = useRemoveScheduleItemMutation();
    const ticketsData = useGetBookedTicketsQuery(params.id || "");
    const user = useSelector(selectUser);

    if(isLoading){
        return <span>Загрузка</span>
    }
     
    // if(!data) return <Navigate to='/'/>;
    if(!data) return <span>{data}</span>;
    // else return <span>{data}</span>

    const showModal = ()=>{
        setIsModalOpen(true);
    }
    const hideModal = ()=>{
        setIsModalOpen(false);
    }

    const handleDeleteTheater = async () => {
        hideModal();
        try{
            await removeScheduleItem(data.schedule_id).unwrap();
            navigate(`${Paths.status}/theaterDeleted`);
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }

    const onSeatClick = async (key: number) => {
        try{
            console.log(12, {
                place: `${key}`,
                user_id: `${user?.id}`,
                schedule_id: `${params.id}`
            });
            await bookTicket({
                place: `${key}`,
                user_id: `${user?.id}`,
                schedule_id: `${params.id}`
            }).unwrap();
            navigate(`${Paths.cart}`);
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }
    const onBookedSeatClick = async (key: number) => {
        try{
            alert('Место недоступно');
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }

    const RenderSeats = () => {
        let seatArray = [], ticketAlreadyBooked = false;
        for(let i = 0; i < data.capacity/10; i++){
            let colValue1 = [];
            for(let j = 0; j < 10; j++){
                if(ticketsData.data){
                    for(let item in ticketsData.data){
                        if(+ticketsData.data[item].place == i*10+(j+1)){
                            console.log(ticketsData.data[item].place, 123);
                            ticketAlreadyBooked=true;
                        }
                    }
                }
                let colValue;
                if(ticketAlreadyBooked) {
                    ticketAlreadyBooked = false;
                    colValue = 
                        <span key={i*10+(j+1)}>
                            <span className={'booked-tickets'} onClick={() => onBookedSeatClick((i*10+j+1))}>
                                {i*10+(j+1)}
                            </span>
                        </span>
                }
                else {
                colValue = 
                // <Link to = '/'>
                    <span key={i*10+(j+1)}>
                        <span className={'tickets'} onClick={() => onSeatClick((i*10+j+1))}>
                            {i*10+(j+1)}
                        </span>
                    </span>
                }
                // </Link>
                colValue1.push(colValue);
                if(j==9) colValue1.push(<br/>);
            }
            seatArray.push(<span className='ticketRow'>{colValue1}</span>);
        }
        return (
          <div>{seatArray}</div>
        ) 
      }
  return (
    
    <Layout>
        <Typography.Title level={1}>
            Билеты
        </Typography.Title>
        {
            user?.role === 'admin' ? (
                <CustomButton
                            shape='round'
                            danger
                            onClick={showModal}
                            icon={<DeleteOutlined/>} 
                        >
                            Удалить
                    </CustomButton>
            ) : (<></>)
        }
        <br/>
        <RenderSeats/>
        <Modal
            title='Подтвердите удаление'
            open = {isModalOpen}
            onOk = { handleDeleteTheater }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Вы действительно хотите удалить театр из таблицы
        </Modal>
    </Layout>
  )
}
