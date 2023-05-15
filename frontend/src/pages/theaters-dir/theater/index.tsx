import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Actor, useGetActorsQuery, useGetTheaterQuery, useRemoveTheaterMutation } from '../../../app/services/theaters';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';
import { Layout } from '../../../components/layout';
import { Descriptions, Divider, Modal, Space, Image, Typography } from 'antd';
import { CustomButton } from '../../../components/custom-button';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../components/error-message';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import Table, { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<Actor> = [
    {
        title: 'Имя',
        dataIndex: 'firstname',
        key: 'firstname'
    },
    {
        title: 'Фамилия',
        dataIndex: 'lastname',
        key: 'lastname'
    },
    {
        title: 'Дата рождения',
        dataIndex: 'birth_date',
        key: 'birth_date'
    }
]

export const TheaterInfo = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data, isLoading} = useGetTheaterQuery(params.id || "");
    const actorsData = useGetActorsQuery(params.id || '');
    const [removeTheater] = useRemoveTheaterMutation();
    const user = useSelector(selectUser);

    if(isLoading){
        return <span>Загрузка</span>
    }
     
    if(!data) return <Navigate to='/'/>;

    const showModal = ()=>{
        setIsModalOpen(true);
    }
    const hideModal = ()=>{
        setIsModalOpen(false);
    }

    const handleDeleteTheater = async () => {
        hideModal();

        try{
            await removeTheater(data.theater_id).unwrap();
            navigate(`${Paths.status}/theaterDeleted`);
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }
    const goToAddActor = () => navigate(`${Paths.addActor}/${data.theater_id}`)

    const goToAddArea = () => navigate(`${Paths.addArea}/${data.theater_id}`)
  return (
    <Layout>
        <Typography.Title level={1}>
                Информация о театре
        </Typography.Title>
        <br/>
        <Space>
            <Descriptions>
                <Descriptions.Item label='Название' span={3}>
                    {data.name}
                </Descriptions.Item>
                <Descriptions.Item label='Описание' span={3}>
                    {data.description}  
                </Descriptions.Item>
                <Descriptions.Item label='Адрес' span={3}>
                    {data.address}  
                </Descriptions.Item>
            </Descriptions>
        </Space>
                <Space>
                    <Image
                        width={200}
                        src={`https://localhost:9000/static/${data.img_name}`}
                        fallback="data:image/png;base64,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"
                    />
                </Space>
        {user?.role === 'admin' && (
            <>
                <Divider orientation='left'>
                    Действия
                </Divider>
                <Space>
                    <Link to={`${Paths.updateTheater}/${data.theater_id}`}>
                        <CustomButton
                            shape='round'
                            type='default'
                            icon={<EditOutlined/>} 
                        >
                            Редактировать
                        </CustomButton>
                    </Link>
                    <CustomButton type='default' shape='round' onClick={ goToAddActor } icon = {<PlusCircleOutlined/>}>
                        Добавить актера
                    </CustomButton>
                    <CustomButton type='default' shape='round' onClick={ goToAddArea } icon = {<PlusCircleOutlined/>}>
                        Добавить зал
                    </CustomButton>
                    <CustomButton
                            shape='round'
                            danger
                            onClick={showModal}
                            icon={<DeleteOutlined/>} 
                        >
                            Удалить
                    </CustomButton>
                </Space>
            </>
        )}
        <ErrorMessage message={ error }/>
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
        <Table
            loading = { isLoading }
            dataSource = { actorsData.data }
            pagination = { false }
            columns={ columns }
            rowKey={ (record) => record.actors_id }
            onRow={ 
                (record) => {
                    return {
                        onClick: () => {
                            navigate(`${Paths.actor}/${record.actors_id}`)
                        }
                    }
                } 
            }
        />
    </Layout>
  )
}
