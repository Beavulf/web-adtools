/**
 * @component OneTimeColumns
 * @description
 * Описание колонок для таблицы разовых задач (OneTime). Используется для отображения информации о сотрудниках,
 * их логинах, дате задачи и текущем действии (включить/выключить) в виде тегов. 
 * Колонки включают сортировку и фильтрацию для удобства пользователя.
 * 
 * Пример использования — передать в Table компонент как columns:
 * <Table columns={OneTimeColumns} dataSource={...} />
 * 
 * Использует Ant Design компоненты (Tag) и определяет форматирование дат и состояния.
 */

import React from "react";
import { 
    Flex,
    Tag
} from "antd";
import RecordAction from "./RecordAction";

const OneTimeColumns = [
    {
        title: 'ФИО',
        dataIndex: 'fio',
        key: 'fio',
        sorter: (a, b) => a.fio.localeCompare(b.fio, 'ru', { sensitivity: 'base' }),
        ellipsis: true,
    },
    {
        title: 'Логин',
        dataIndex: 'login',
        key: 'login',
        sorter: (a, b) => a.login.localeCompare(b.login, 'en', { sensitivity: 'base' }),
        width: 130,
        ellipsis: true,
    },
    {
        title: 'Дата',
        dataIndex: 'date',
        key: 'date',
        render: (text, record) => {
            const dateStr = new Date(text).toLocaleDateString();
            return dateStr
        },
        sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        ellipsis: true,
    },
    {
        title: 'Действие',
        dataIndex: 'state',
        key: 'state',
        filters: [
            { text: 'включить', value: true },
            { text: 'выключить', value: false },
        ],
        render: (text, record) => {
            return (
                <Tag color={text ? 'green' : 'red'} style={{fontSize:'16px'}}>
                    {text ? 'Включить' : 'Выключить'}
                </Tag>
            );
        },
        onFilter: (value, record) => record.state === value,
        ellipsis: true,
    },
    {
        title: 'Описание',
        dataIndex: 'description',
        key: 'description',
        render: (text) => (text ? text : '-'),
        ellipsis: true,
    },
    {
        title: 'Создан',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text, record) => {
            const dateStr = new Date(text).toLocaleDateString();
            const timeStr = new Date(record?.createdAt).toLocaleTimeString();
            return (
                <Flex vertical key={`created-${record.id}`}>
                    <span>{dateStr}</span>
                    <span style={{ color: 'gray' }}>
                        {record?.createdBy} {timeStr}
                    </span>
                </Flex>
            );
        },
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        width: 150,
        ellipsis: true,
    },
    {
        title: 'Обновлен',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text, record) => {
            const dateStr = new Date(text).toLocaleDateString();
            const timeStr = new Date(record?.updatedAt).toLocaleTimeString();
            return (
                <Flex vertical key={`updated-${record.id}`}>
                    <span>{dateStr}</span>
                    <span style={{ color: 'gray' }}>
                        {record?.updatedBy} {timeStr}
                    </span>
                </Flex>
            );
        },
        sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        width: 150,
        ellipsis: true,
    },
    {
        title: 'Действия',
        key: 'actions',
        render: (_, record) => <RecordAction record={record}/>,
        width: 80,
    }
]

export default OneTimeColumns;