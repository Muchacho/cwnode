import { Button, Result, Row } from 'antd';
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Paths } from '../../paths';

const Statuses: Record<string, string> = {
    theaterCreated: 'Театр успешно добавлен',
    theaterUpdated: 'Театр успешно обнавлен',
    theaterDeleted: 'Театр успешно удален',
    showCreated: 'Представление успешно добавлено',
    showUpdated: 'Представление успешно обнавлено',
    showDeleted: 'Представление успешно удалено',
}

export const Status = () => {
    const {status} = useParams();
  return (
    <Row align='middle' justify='center' style={{width: '100%'}}>
        <Result
            status = {status ? "success" : 404}
            title = {status ? Statuses[status] : 'Не найдено'}
            extra = {
                <Button key='dashboard'>
                    <Link to={Paths.home}> На главную</Link>
                </Button>
            }
        />
    </Row>
  )
}
