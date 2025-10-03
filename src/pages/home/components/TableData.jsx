import React, { useEffect } from "react";
import {
    Flex,
    Input,
    Table,
    Tag
} from 'antd'
import { gql } from '@apollo/client'
import { useQuery } from "@apollo/client/react";

const GET_SCHEDULES = gql`
    query GetSchedules($fio: String) {
    getSchedules(filter: {
        fio: { contains: $fio }
    }) {
        id
        fio
        login
        type
        order
        startDate
        endDate
        status
        description
        createdAt
        updatedAt
        createdBy
        updatedBy
        recall
    }
}
`;

const typeLabels = {
    OTPYSK: 'Отпуск',
    STAJIROVKA: 'Стажировка',
    PRODLENIE_OTPYSKA: 'Продление',
    KOMANDIROVKA: 'Командировка',
    UCHEBA: 'Учеба',
    DEKRET: 'Декрет',
  };

const scheduleColumns = [
    {
        title: 'ФИО',
        dataIndex: 'fio',
        key: 'fio',
        sorter: (a, b) => a.fio.localeCompare(b.fio, 'ru', { sensitivity: 'base' }),
    },
    {
        title: 'Логин',
        dataIndex: 'login',
        key: 'login',
        sorter: (a, b) => a.login.localeCompare(b.login, 'en', { sensitivity: 'base' }),
    }, 
    {
        title: 'Тип',
        dataIndex: 'type',
        key: 'type',
        filters:[
            {
                text:'Отпуск',
                value:'OTPYSK'
            },
            {
                text:'Стажировка',
                value:'STAJIROVKA'
            },
            {
                text:'Продление',
                value:'PRODLENIE_OTPYSKA'
            },
            {
                text:'Командировка',
                value:'KOMANDIROVKA'
            },
            {
                text:'Учеба',
                value:'UCHEBA'
            },
            {
                text:'Декрет',
                value:'DEKRET'
            },
        ],
        onFilter: (value, record) => record.type === value,
        filterSearch: true,
        render: (text, record) => (
            <Flex vertical>
                <Tag color="magenta">{typeLabels[text] || text}</Tag>
                {record?.order}
            </Flex>
        )
    },
    {
        title: 'Даты',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text,record) => (
            <Flex vertical>
                <span>{new Date(text).toLocaleDateString()}</span> 
                <span style={{color:'gray'}}>по-{new Date(record.endDate).toLocaleDateString()}</span>
            </Flex>
        )
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        render: (text) => (
            text ? <Tag color="green">Выполняется</Tag> 
            : <Tag color="orange">Ожидание</Tag>
        )
    },
    {
        title: 'Создан',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text, record) => (
            <Flex vertical>
                <span>{new Date(text).toLocaleDateString()}</span> 
                <span style={{color:'gray'}}>{record?.createdBy}</span>
            </Flex>
        )
    },
    {
        title: 'Обновлен',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text, record)=>(
            <Flex vertical>
                <span>{new Date(text).toLocaleDateString()}</span> 
                <span style={{color:'gray'}}>{record?.updatedBy}</span>
            </Flex>
        )
    },
    {
        title: 'Описание',
        dataIndex: 'description',
        key: 'description',
        render: (text) => (text ? text : '-'),
        width: 100,
        ellipsis: true,
    },
    {
        title: 'Отзыв',
        dataIndex: 'recall',
        key: 'recall',
        render: (text) => (text ? text : '-'),
        width:60
    },
]

const {Search} = Input

const TableData = ()=> {

    const {data: dataSchedules, loading: loadingSchedules, error: errorSchedules} = useQuery(GET_SCHEDULES, {
        variables:{fio: ""},
        pollInterval: 10000
    });
    useEffect(()=>{
        console.log(dataSchedules?.getSchedules)
        console.log(errorSchedules)
    },[dataSchedules, errorSchedules])

    return (
        <Flex vertical flex={1} gap={5}>
            <Search placeholder="Поиск по ФИО, логину..."/>
            <div style={{flex: 1, minHeight: 0, overflow: 'auto'}}>
                <Table
                    dataSource={dataSchedules?.getSchedules}
                    columns={scheduleColumns}
                    size="small"
                />
            </div>
        </Flex>
    )
}
export default TableData;