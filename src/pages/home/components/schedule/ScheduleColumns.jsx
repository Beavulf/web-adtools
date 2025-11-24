/**
 * scheduleColumns - функция, возвращающая массив колонок для таблицы расписаний.
 * Используется для рендера таблиц отпусков, стажировок и др. в разделе "Расписание".
 * В зависимости от параметра isArchive отображает ли таблицу в режиме архива (без кнопок действий).
 *
 * @param {boolean} [isArchive=false] - Если true, скрывает действия для архивных записей.
 * @returns {Array} Массив конфигураций колонок для компонента <Table/>
 *
 * @example
 * // стандартные колонки
 * const columns = scheduleColumns();
 * // для архива (без действий)
 * const columns = scheduleColumns(true);
 */


import React from "react";
import { Tag, Flex } from "antd";
import RecordAction from "./RecordAction";

// Словари для отображения типа отпуска и цвета
export const SCHEDULE_TYPE_LABELS = {
    OTPYSK: 'Отпуск',
    STAJIROVKA: 'Стажировка',
    PRODLENIE_OTPYSKA: 'Продление',
    KOMANDIROVKA: 'Командировка',
    UCHEBA: 'Учеба',
    DEKRET: 'Декрет',
};

export const SCHEDULE_TYPE_COLORS = {
    OTPYSK: 'magenta',
    STAJIROVKA: 'volcano',
    PRODLENIE_OTPYSKA: 'purple',
    KOMANDIROVKA: 'gold',
    UCHEBA: 'cyan',
    DEKRET: 'geekblue',
};

// Основной массив столбцов для таблицы расписания
const scheduleColumns = (isArchive = false) => {
    return [
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
            filters: [
                { text: 'Отпуск', value: 'OTPYSK' },
                { text: 'Стажировка', value: 'STAJIROVKA' },
                { text: 'Продление', value: 'PRODLENIE_OTPYSKA' },
                { text: 'Командировка', value: 'KOMANDIROVKA' },
                { text: 'Учеба', value: 'UCHEBA' },
                { text: 'Декрет', value: 'DEKRET' },
            ],
            onFilter: (value, record) => record.type === value,
            filterSearch: true,
            render: (text, record) => {
                const tagColor = SCHEDULE_TYPE_COLORS[text] || 'magenta';
                const tagLabel = SCHEDULE_TYPE_LABELS[text] || text;
                return (
                    <div key={`type-${record.id}`}>
                        <Tag color={tagColor}>
                            {tagLabel}
                        </Tag>
                        <Flex vertical>
                            {record?.order}
                        </Flex>
                    </div>
                );
            },
            width: 120,
            ellipsis: true,
        },
        {
            title: 'Даты',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text, record) => {
                const startDate = new Date(text).toLocaleDateString();
                const endDate = new Date(record.endDate).toLocaleDateString();
                return (
                    <Flex vertical key={`dates-${record.id}`}>
                        <span>{startDate}</span>
                        <span style={{ color: 'gray' }}>по-{endDate}</span>
                    </Flex>
                );
            },
            width: 115,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Ожидание', value: false },
                { text: 'Выполняется', value: true },
            ],
            onFilter: (value, record) => record.status === value,
            render: (text, record) =>
                text ? 
                <Tag color="green" key={`status-${record.id}`}>
                    Выполняется
                </Tag> : 
                <Tag color="orange" key={`status-${record.id}`}>Ожидание</Tag>,
            width: 100,
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
            filters: [
                { text: 'отозван', value: true },
                { text: 'нет', value: false },
            ],
            onFilter: (value, record) => record.isRecall === value,
            render: (text) => (
                <Tag color={text ? 'orange' : 'blue'}>
                    {text ? 'отозван' : 'нет'}
                </Tag>
            ),
            width: 78,
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => isArchive ? null : <RecordAction record={record} />,
            width: 120,
        },
    ];
}

// Экспорт по умолчанию для использования в других компонентах
export default scheduleColumns;