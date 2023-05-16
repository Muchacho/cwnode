import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../../../components/layout'
import { CustomButton } from '../../../components/custom-button'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, InputRef, Space, Table, Typography } from 'antd'
// import { Theater, useGetAllTheatersQuery } from '../../app/services/theaters'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../../paths'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/auth/authSlice'
import { Show, useGetAllShowsQuery } from '../../../app/services/shows'
// import Highlighter from 'react-highlight-words';
// import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from 'antd/es/table/interface'
import jwt from 'jwt-decode'
import { CustomInput } from '../../../components/custom-input'

const columns: ColumnsType<Show> = [
  {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
  },
  {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description'
  },
  {
      title: 'Продолжительность',
      dataIndex: 'duration',
      key: 'description'
  }
]

export const Shows = () => {

    // const [searchText, setSearchText] = useState('');
    // const [searchedColumn, setSearchedColumn] = useState('');
    // const searchInput = useRef<InputRef>(null);
    // type ShowIndex = keyof Show;

    const [searchText, setSearchText] = useState("");

    const { data, isLoading } = useGetAllShowsQuery();
    const [ tableData, setTableData] = useState(data);
    let token = localStorage.getItem('token');
    let tokenDecode = {id: -1, role: 'non auth'}

    const navigate = useNavigate();
    // const user = useSelector(selectUser);
    // useEffect(()=> {
    //     if(!user)navigate(Paths.login);
    // }, [navigate, user])

    const goToAddShow = () => navigate(Paths.addShow)

    // const handleSearch = (
    //     selectedKeys: string[],
    //     confirm: (param?: FilterConfirmProps) => void,
    //     dataIndex: ShowIndex,
    //   ) => {
    //     confirm();
    //     setSearchText(selectedKeys[0]);
    //     setSearchedColumn(dataIndex);
    //   };
    
    //   const handleReset = (clearFilters: () => void) => {
    //     clearFilters();
    //     setSearchText('');
    //   };
    
    //   const getColumnSearchProps = (data:ShowIndex): ColumnType<Show> => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    //       <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
    //         <Input
    //           ref={searchInput}
    //           placeholder={`Search ${data}`}
    //           value={selectedKeys[0]}
    //           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //           onPressEnter={() => handleSearch(selectedKeys as string[], confirm, data)}
    //           style={{ marginBottom: 8, display: 'block' }}
    //         />
    //         <Space>
    //           <Button
    //             type="primary"
    //             onClick={() => handleSearch(selectedKeys as string[], confirm, data)}
    //             icon={<SearchOutlined />}
    //             size="small"
    //             style={{ width: 90 }}
    //           >
    //             Search
    //           </Button>
    //           <Button
    //             onClick={() => clearFilters && handleReset(clearFilters)}
    //             size="small"
    //             style={{ width: 90 }}
    //           >
    //             Reset
    //           </Button>
    //           <Button
    //             type="link"
    //             size="small"
    //             onClick={() => {
    //               confirm({ closeDropdown: false });
    //               setSearchText((selectedKeys as string[])[0]);
    //               setSearchedColumn(data);
    //             }}
    //           >
    //             Filter
    //           </Button>
    //           <Button
    //             type="link"
    //             size="small"
    //             onClick={() => {
    //               close();
    //             }}
    //           >
    //             close
    //           </Button>
    //         </Space>
    //       </div>
    //     ),
    //     filterIcon: (filtered: boolean) => (
    //       <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    //     ),
    //     onFilter: (value, record) =>
    //       record[data]
    //         .toString()
    //         .toLowerCase()
    //         .includes((value as string).toLowerCase()),
    //     onFilterDropdownOpenChange: (visible) => {
    //       if (visible) {
    //         setTimeout(() => searchInput.current?.select(), 100);
    //       }
    //     },
    //     render: (text) =>
    //       searchedColumn === data ? (
    //         text
    //         // <Highlighter
    //         //   highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //         //   searchWords={[searchText]}
    //         //   autoEscape
    //         //   textToHighlight={text ? text.toString() : ''}
    //         // />
    //       ) : (
    //         text
    //       ),
    //   });


    //   const columns: ColumnsType<Show> = [
    //     {
    //         title: 'Название',
    //         dataIndex: 'name',
    //         key: 'name',
    //         ...getColumnSearchProps('name'),
    //     },
    //     {
    //         title: 'Описание',
    //         dataIndex: 'description',
    //         key: 'description'
    //     },
    //     {
    //         title: 'Продолжительность',
    //         dataIndex: 'duration',
    //         key: 'description'
    //     }
    // ]
    const searchItem = (event: any) => {
      console.log(event.target);
      // return '';
      // let result = [];
      // if(data)
      // for(let elem in data){
      //   if(data[elem].name == event.target)
      //     result.push(data[elem]);
      // }
      // setTableData(result);
    }

    const addButton = () => {
        if(token) tokenDecode = {...jwt(token)};
        console.log(tokenDecode);
        if(tokenDecode && tokenDecode?.role == 'admin') {
            return (
              <Space>
                <CustomButton type='primary' onClick={ goToAddShow } icon = {<PlusCircleOutlined/>}>
                    Добавить
                </CustomButton>
              </Space>
            )
        }
        return (<></>)
    }

  return (
    <Layout>
        <Typography.Title level={1}>
                Представление
        </Typography.Title>
        {
            addButton()
        }
        <CustomInput type='text' name='search' placeholder='Поиск...' onChange={(event)=>{
                  console.log(event.target.value);
                  let result = [];
                  if(data)
                  for(let elem in data){
                    console.log(data[elem].name);
                    if(data[elem].name.indexOf(event.target.value) >= 0)
                      result.push(data[elem]);
                  }
                  console.log(result)
                  if(result.length != 0)
                    setTableData(result);
                }}/>
        <Table
            loading = { isLoading }
            dataSource = { tableData? tableData : data }
            pagination = { false }
            columns={ columns }
            rowKey={ (record) => record.show_id }
            onRow={ 
                (record) => {
                    return {
                        onClick: () => {
                            navigate(`${Paths.show}/${record.show_id}`)
                        }
                    }
                } 
            }
        />
    </Layout>
  )
}
