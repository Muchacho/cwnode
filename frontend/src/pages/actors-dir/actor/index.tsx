import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Paths } from '../../../paths';
import { Layout } from '../../../components/layout';
import { Descriptions, Divider, Modal, Space, Table, Typography } from 'antd';
import { CustomButton } from '../../../components/custom-button';
import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../../../components/error-message';
import { isErrorWithMessage } from '../../../utils/is-error-with-message';
import { CommentData, FullShowInfo, useGetCommentsQuery, useGetShowQuery, useRemoveShowMutation } from '../../../app/services/shows';
import { ColumnsType } from 'antd/es/table';
import { useGetActorQuery, useRemoveActorMutation } from '../../../app/services/actors';

// const columns: ColumnsType<FullShowInfo['schedule'][0]> = [
//     {
//         title: 'Цена билета(BYN)',
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


export const ActorInfo = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {data, isLoading} = useGetActorQuery(params.id || "");
    // const commentsData = useGetCommentsQuery(params.id || "");
    const [removeActor] = useRemoveActorMutation();
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

    const handleDeleteActor = async () => {
        hideModal();

        try{
            await removeActor(data.actors_id).unwrap();
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
                Информация об актёре
        </Typography.Title>
        <br/>
        <Descriptions>
            <Descriptions.Item label='Имя' span={3}>
                {data.firstname}
            </Descriptions.Item>
            <Descriptions.Item label='Фамилия' span={3}>
                {data.lastname}  
            </Descriptions.Item>
            <Descriptions.Item label='Дата рождения' span={3}>
                {data.birth_date}  
            </Descriptions.Item>
            <Descriptions.Item label='Описание' span={3}>
                {data.description}  
            </Descriptions.Item>
            
        </Descriptions>
        <Divider orientation='left'>
            Действия
        </Divider>
        <Space>
            {user?.role === 'admin' && (
                <>
                    <Link to={`${Paths.updateActor}/${data.actors_id}`}>
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
            onOk = { handleDeleteActor }
            onCancel={ hideModal }
            okText='Подтвердить'
            cancelText='Отменить'
        >
            Вы действительно хотите удалить актёра из таблицы?
        </Modal>
    </Layout>
  )
}
