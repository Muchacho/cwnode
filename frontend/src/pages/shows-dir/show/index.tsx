import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';
import { Layout } from '../../../components/layout';
import { Descriptions, Divider, Modal, Space, Table, Typography } from 'antd';
import { CustomButton } from '../../../components/custom-button';
import { DeleteOutlined, EditOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../components/error-message';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { CommentData, FullShowInfo, useGetCommentsQuery, useGetShowQuery, useRemoveShowMutation } from '../../../app/services/shows';
import { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<FullShowInfo['schedule'][0]> = [
    {
        title: 'Цена билета(BYN)',
        dataIndex: 'price',
        key: 'price'
    },
    {
        title: 'Театр',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Время',
        dataIndex: 'start_time',
        key: 'start_time'
    }
]

const commentColumns: ColumnsType<CommentData> = [
    {
        title: 'Пользователь',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Оценка',
        dataIndex: 'rating',
        key: 'rating'
    },
    {
        title: 'Комментарий',
        dataIndex: 'comment',
        key: 'comment'
    }
]


export const ShowInfo = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data, isLoading} = useGetShowQuery(params.id || "");
    const commentsData = useGetCommentsQuery(params.id || "");
    const [removeShow] = useRemoveShowMutation();
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

    const handleDeleteShow = async () => {
        hideModal();

        try{
            await removeShow(data.show.show_id).unwrap();
            navigate(`${Paths.status}/showDeleted`);
        }catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else setError('Неизвестная ошибка');
        }
    }
  return (
    <Layout>
        <Typography.Title level={1}>
                Информация о представлении
        </Typography.Title>
        <br/>
        <Descriptions>
            <Descriptions.Item label='Название' span={3}>
                {data.show.name}
            </Descriptions.Item>
            <Descriptions.Item label='Описание' span={3}>
                {data.show.description}  
            </Descriptions.Item>
            <Descriptions.Item label='Продолжительность' span={3}>
                {data.show.duration} минут
            </Descriptions.Item>
            {
                data.show.rating ? (
                    <Descriptions.Item label='Рейтинг' span={3}>
                        {data.show.rating}
                    </Descriptions.Item>
                ) : (
                    <Descriptions.Item label='Рейтинг' span={3}>
                        Рейтинг отсутствует
                    </Descriptions.Item>
                )
            }
            
        </Descriptions>
        <Divider orientation='left'>
            Действия
        </Divider>
        <Space>
            <Link to={`${Paths.addComment}/${data.show.show_id}`}>
                <CustomButton
                    shape='round'
                    type='default'
                    icon={<FormOutlined/>} 
                >
                    Комментировать
                </CustomButton>
            </Link>
            {user?.role === 'admin' && (
                <>
                    <Link to={`${Paths.updateShows}/${data.show.show_id}`}>
                        <CustomButton
                            shape='round'
                            type='default'
                            icon={<EditOutlined/>} 
                        >
                            Редактировать
                        </CustomButton>
                    </Link>
                    <CustomButton
                            shape='round'
                            danger
                            onClick={showModal}
                            icon={<DeleteOutlined/>} 
                        >
                            Удалить
                    </CustomButton>
                </>
            )}
        </Space>
        <ErrorMessage message={ error }/>
        <Modal
            title='Подтвердите удаление'
            open = {isModalOpen}
            onOk = { handleDeleteShow }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Вы действительно хотите удалить представление из таблицы
        </Modal>
        <br/>
        <br/>
        <br/>
        <Typography.Title level={1}>
                Расписание
        </Typography.Title>
        {
                user?.role === 'admin' ? (
                <CustomButton type='primary' onClick={ ()=>{navigate(`${Paths.addScheduleItem}/${data.show.show_id}`)} } icon = {<PlusCircleOutlined/>}>
                    Добавить
                </CustomButton>
                ) : (<></>)
        }
        <Table
            loading = { isLoading }
            dataSource = { data.schedule }
            pagination = { false }
            columns={ columns }
            rowKey={ (record) => record.schedule_id }
            onRow={ 
                (record) => {
                    return {
                        onClick: () => {
                            navigate(`${Paths.schedule}/${record.schedule_id}`)
                        }
                    }
                } 
            }
        />
        <br/>
        <br/>
        <br/>
        <Typography.Title level={1}>
                Комментарии
        </Typography.Title>
        <Table
            loading = { isLoading }
            dataSource = { commentsData.data }
            pagination = { false }
            columns={ commentColumns }
        />
    </Layout>
  )
}
