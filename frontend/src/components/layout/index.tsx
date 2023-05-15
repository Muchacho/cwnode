import React from 'react';
import styles from './index.module.css';
import { Layout as AntLayot } from 'antd';
import { Header } from '../header';

type Props = {
    children: React.ReactNode
}

export const Layout = ({children}:Props) => {
  return (
    <div className={styles.main}>
        <Header/>
        <AntLayot.Content style={{height:'100%'}}>
            {children}
        </AntLayot.Content>
    </div>
  )
}
