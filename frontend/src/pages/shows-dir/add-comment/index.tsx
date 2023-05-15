import React, { useEffect, useState } from 'react'
import { Layout } from '../../../components/layout'
import { Row } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Paths } from '../../../paths'
import { isErrorWithMessage } from '../../../utils/is-error-with-message'
import { selectUser } from '../../../features/auth/authSlice'
import { CommentData, Show, useAddCommentMutation, useAddShowMutation } from '../../../app/services/shows'
import { ShowForm } from '../../../components/shows-form'
import { CommentsForm } from '../../../components/comments-form'

export const AddComment = () => {

    const params = useParams();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addComment] = useAddCommentMutation();

    useEffect(()=>{
        if(!user) navigate(Paths.login);
    }, [navigate, user])

    const handleAddComment = async (data: CommentData) => {
        try{
            await addComment({
                show_id: params.id? params.id : '0',
                email: '',
                rating: data.rating,
                comment: data.comment
            }).unwrap();
            navigate(`${Paths.status}/created`);
        } catch(error){
            const maybeError = isErrorWithMessage(error);
            if(maybeError) setError(error.data.message);
            else {
                setError('Неизвестная ошибка');
            }
        }
    };

    return (
        <Layout>
            <Row align="middle" justify='center'>
                <CommentsForm 
                    title='Добавить комментарий'
                    btnText='Добавить'
                    onFinish={ handleAddComment }
                    error= { error }
                />
            </Row>
        </Layout>
  )
}
