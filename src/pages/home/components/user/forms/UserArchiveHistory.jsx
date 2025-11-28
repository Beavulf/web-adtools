/**
 * UserArchiveHistory — модальное окно с таблицей архивных задач пользователя.
 *
 * Показывает архивные записи и общую статистику (сумма дней, количество по типу задачи).
 * Страница построена на Ant Design: таблица, кнопки, поиск, попапы.
 * Не отображает действия (архивировать/удалить), только информация.
 *
 * @component
 * @param {Object} props - Свойства компонента
 * @param {string} props.sAMAccountName - Логин пользователя для загрузки архивных задач
 * @param {boolean} props.isOpen - Флаг открытия модального окна
 * @param {function} props.onCancel - Обработчик закрытия модалки
 *
 * @example
 * <UserArchiveHistory
 *    sAMAccountName="ivanov"
 *    isOpen={showArchive}
 *    onCancel={()=>setShowArchive(false)}
 * />
 */
import React, { useState, useMemo, useDeferredValue, useEffect } from "react";
import {
    Button,
    Flex,
    Table,
    Popover,
    Input,
    Typography,
    Modal
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import scheduleColumns from "../../schedule/ScheduleColumns";
import { useCustomMessage } from "../../../../../context/MessageContext";
import useArchiveStatistics from "../../../../../hooks/user/useArchiveStatistics";
import filterSchedules from "../../../../../utils/filterSchedules";
import UserRecallInfo from "../../schedule/UserRecallInfo";
import { useSchedule } from "../../../../../hooks/api/useSchedule";
import styled from "styled-components";

const {Search} = Input;
const {Text} = Typography;

const StyledInfoBlock = styled(Flex)`
    border-radius: 8px;
    padding: 5px;
    background-color: rgba(243, 243, 243, 0.32);
    flex: 1;
    align-items: center;
    display: flex;
`;

const UserArchiveHistory = React.memo(({sAMAccountName, isOpen, onCancel})=>{
    const {actions, loading, fetchArchiveSchedulesData} = useSchedule({
        onError: (error) => msgError(`Ошибка при работе с Задачами: ${error.message || error}`)
    });
    const {msgError} = useCustomMessage();
    const [confirmTextValue, setConfirmTextValue] = useState("");
    const deferredConfirmValue = useDeferredValue(confirmTextValue);

    // true потому что архивные записи (не будут отображаться кнопки действий)
    const columns = scheduleColumns(true);

    // получение статистики по типу задач
    const statsByType = useArchiveStatistics(fetchArchiveSchedulesData);

    const handleFetchArchiveSchedules = async () => {
        try {
            setConfirmTextValue('');
            await actions.fetchArchiveSchedules({variables: 
                {
                    filter: {login: {contains: sAMAccountName}}
                }
            });
        }
        catch(err) {
            setConfirmTextValue('');
            msgError(err.message)
        }
    };

    useEffect(()=>{
        if (!isOpen) return;
        const fetchData = async () => {
            await handleFetchArchiveSchedules();
        }
        fetchData()
    },[isOpen, sAMAccountName]);

    const handleSearch = (value) => {
        setConfirmTextValue(value);
    };

    // фильтрация таблицы
    const filteredSchedules = useMemo(() => {
        return filterSchedules(fetchArchiveSchedulesData, deferredConfirmValue);
    }, [fetchArchiveSchedulesData, deferredConfirmValue]);

    
    return (
        <Modal
            title='Просмотр истории задач из Архива'
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
            width={1500}
            style={{top:'20px'}}
        >
        <Flex vertical gap={10}>
            <Flex gap={5}>
                <Popover content={<span>Строк в таблице</span>}>
                    <Button type="" style={{color:'gray'}}>{fetchArchiveSchedulesData?.length}</Button>
                </Popover>
                <Search 
                    placeholder="Поиск по ФИО, логину, датам (гггг-мм-дд), приказу, описанию..."
                    onSearch={handleSearch}
                    allowClear  
                />
                <Popover content={<span>Обновить таблицу</span>}>
                    <Button 
                        onClick={handleFetchArchiveSchedules} 
                        disabled={loading.fetchArchiveSchedules} 
                        icon={<SyncOutlined spin={loading.fetchArchiveSchedules}/>} 
                        title="Обновить таблицу"
                    />
                </Popover>
            </Flex>
            <Flex gap={10} justify="space-between">
                <StyledInfoBlock vertical gap={2}>
                    <Text>Выходов в отпуск - {statsByType.OTPYSK?.totalCount || 0}</Text>
                    <Text>дней в отпуске - {statsByType.OTPYSK?.totalDays || 0}</Text>
                </StyledInfoBlock>
                <StyledInfoBlock vertical gap={2}>
                    <Text>Выходов на стажировку - {statsByType.STAJIROVKA?.totalCount || 0}</Text>
                    <Text>дней в стажировке - {statsByType.STAJIROVKA?.totalDays || 0}</Text>
                </StyledInfoBlock>
                <StyledInfoBlock vertical gap={2}>
                    <Text>Выходов в декрет - {statsByType.DEKRET?.totalCount || 0}</Text>
                    <Text>дней в декрете - {statsByType.DEKRET?.totalDays || 0}</Text>
                </StyledInfoBlock>
                <StyledInfoBlock vertical gap={2}>
                    <Text>Выходов на учебу - {statsByType.UCHEBA?.totalCount || 0}</Text>
                    <Text>дней в учебе - {statsByType.UCHEBA?.totalDays || 0}</Text>
                </StyledInfoBlock>
                <StyledInfoBlock vertical gap={2}>
                    <Text>Продлений отпуска - {statsByType.PRODLENIE_OTPYSKA?.totalCount || 0}</Text>
                    <Text>дней продления - {statsByType.PRODLENIE_OTPYSKA?.totalDays || 0}</Text>
                </StyledInfoBlock>
                <StyledInfoBlock vertical gap={2}>
                    <Text>Выходов в командировку - {statsByType.KOMANDIROVKA?.totalCount || 0}</Text>
                    <Text>дней в командировке - {statsByType.KOMANDIROVKA?.totalDays || 0}</Text>
                </StyledInfoBlock>
            </Flex>
            <Table
                dataSource={filteredSchedules}
                columns={columns}
                size="middle"
                rowKey={'id'}
                loading={loading.fetchArchiveSchedules}
                scroll={{y:'550px'}}
                expandable={{
                    expandedRowRender: (record) => <UserRecallInfo record={record} isArchive={true}/>,
                }}
            />
        </Flex>
        </Modal>
    )
})

export default UserArchiveHistory;