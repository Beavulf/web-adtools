import React from "react";
import { Tag, Flex } from "antd";

// Словари для отображения типа отпуска и цвета
const SCHEDULE_TYPE_LABELS = {
    OTPYSK: 'Отпуск',
    STAJIROVKA: 'Стажировка',
    PRODLENIE_OTPYSKA: 'Продление',
    KOMANDIROVKA: 'Командировка',
    UCHEBA: 'Учеба',
    DEKRET: 'Декрет',
};

const SCHEDULE_TYPE_COLORS = {
    OTPYSK: 'magenta',
    STAJIROVKA: 'volcano',
    PRODLENIE_OTPYSKA: 'purple',
    KOMANDIROVKA: 'gold',
    UCHEBA: 'cyan',
    DEKRET: 'geekblue',
};

const scheduleArchiveColumns = [
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
        title: 'Тип',
        dataIndex: 'type',
        key: 'type',
        render: (text) => {
            const tagColor = SCHEDULE_TYPE_COLORS[text] || 'magenta';
            const tagLabel = SCHEDULE_TYPE_LABELS[text] || text;
            return (
                <Tag color={tagColor}>
                    {tagLabel}
                </Tag>
            );
        },
        width: 125,
        sorter: (a, b) => a.type.localeCompare(b.type, 'en', { sensitivity: 'base' }),
        ellipsis: true,
    },
    {
        title: 'Приказ',
        dataIndex: 'order',
        key: 'order',
        sorter: (a, b) => a.order.localeCompare(b.order, 'ru', { sensitivity: 'base' }),
        width:100
    },
    {
        title: 'Дата с',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text) => {
            const startDate = new Date(text).toLocaleDateString();
            return (
                <span>{startDate}</span> 
            );
        },
        sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
        width: 100,
    },
    {
        title: 'Дата по',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text) => {
            const endDate = new Date(text).toLocaleDateString();
            return (
                <span>{endDate}</span>
            );
        },
        width: 100,
        sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        render: (text) =>
            text ? 
            <Tag color="green">
                Выполняется
            </Tag> : 
            <Tag color="orange">Ожидание</Tag>,
        width: 100,
        sorter: (a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1)
    },
    {
        title: 'Создана',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (text) => {
            return (
                <span style={{color:'gray'}}>{text}</span>
            );
        },
        sorter: (a, b) => a.createdBy.localeCompare(b.createdBy, 'en', { sensitivity: 'base' }),
        ellipsis: true,
    },
    {
        title: 'Дата созд.',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => {
            const dateStr = new Date(text).toLocaleDateString();
            const timeStr = new Date(text).toLocaleTimeString();
            return (
                <span>{dateStr+' '+timeStr}</span>
            );
        },
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        ellipsis: true,
    },
    {
        title: 'Обновлен',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        render: (text) => {
            return (
                <span style={{color:'gray'}}>{text}</span>
            );
        },
        sorter: (a, b) => a.updatedBy.localeCompare(b.updatedBy, 'en', { sensitivity: 'base' }),
        ellipsis: true,
    },
    {
        title: 'Дата изм.',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => {
            const dateStr = new Date(text).toLocaleDateString();
            const timeStr = new Date(text).toLocaleTimeString();
            return (
                <span>{dateStr+' '+timeStr}</span>
            );
        },
        sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        ellipsis: true
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
        dataIndex: 'isRecall',
        key: 'isRecall',
        render: (text) => (
            <Tag style={{}} color={text ? 'orange' : 'blue'}>
                {text ? 'отозван' : 'нет'}
            </Tag>
        ),
        width: 78,
        align: 'center',
    },
];

export default scheduleArchiveColumns;