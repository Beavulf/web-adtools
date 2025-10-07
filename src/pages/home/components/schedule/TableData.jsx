import React, { useEffect, useState, useCallback, useMemo, useDeferredValue } from "react";
import {
    Flex,
    Input,
    Table,
    Button,
    Popover,
} from 'antd'
import { SyncOutlined, ExpandOutlined, CompressOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import scheduleColumns from "./ScheduleColumns";
import { GET_SCHEDULES } from "../../../../query/GqlQuery";

const {Search} = Input

const TableData = React.memo(({onError, onHidden, searchValue})=> {
    const [confirmTextValue, setConfirmTextValue] = useState("");
    const [hiddenUserInfo, setHiddenUserInfo] = useState(false)
    const deferredConfirmValue = useDeferredValue(confirmTextValue);
    // получение списка задач из БД
    const {data: dataSchedules, loading: loadingSchedules, error: errorSchedules, refetch} = useQuery(GET_SCHEDULES, {
        pollInterval: 1200000,
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (searchValue) {
            setConfirmTextValue(searchValue);
        } else {
            setConfirmTextValue("");
        }
    }, [searchValue]);


    // отправка ошибки в родительский компонент
    useEffect(() => {
        if (errorSchedules) onError?.(errorSchedules?.message);
    }, [errorSchedules, onError]);

    // скрытие блока с информацией о пользователе, через передачу родительскому компоненту
    const handleHiddenUserInfo = useCallback(()=>{
        setHiddenUserInfo((prev) => {
            const newValue = !prev;
            onHidden?.(newValue);
            return newValue;
        });
    },[onHidden])

    const handleSearch = useCallback((value) => {
        setConfirmTextValue(value);
    }, []);

    // фильтруем данные
    const filteredSchedules = useMemo(() => {
        if (!dataSchedules?.getSchedules) return [];
        if (!deferredConfirmValue.trim()) return dataSchedules.getSchedules;
        
        const searchLower = deferredConfirmValue.toLowerCase();
        return dataSchedules.getSchedules.filter(obj =>
            ['fio', 'login', 'order', 'createdAt', 'updatedAt', 'description', 'startDate', 'endDate'].some(
                key => {
                    const value = obj[key];
                    return value && String(value).toLowerCase().includes(searchLower);
                }
            )
        );
    }, [dataSchedules, deferredConfirmValue]);
    // мемоизируем колонки таблицы
    const memoizedColumns = useMemo(() => scheduleColumns, []);

    return (
        <Flex vertical gap={5} style={{minHeight:0, transition:'all 0.3s ease-out', height:'100%'}}>
            <Flex gap={5}>
                <Popover content={<span>Строк в таблице</span>}>
                    <Button type="" style={{color:'gray'}}>{filteredSchedules.length}</Button>
                </Popover>
                <Search 
                    placeholder="Поиск по ФИО, логину, датам (гггг-мм-дд), приказу, описанию..."
                    onSearch={handleSearch}
                    allowClear  
                />
                <Popover content={<span>Обновить таблицу (авт. обновление каждые 120 сек.)</span>}>
                    <Button 
                        onClick={() => refetch()} 
                        disabled={loadingSchedules} 
                        icon={<SyncOutlined 
                        spin={loadingSchedules}/>} 
                        title="Обновить таблицу"
                    />
                </Popover>
                <Button 
                    icon={hiddenUserInfo ? <CompressOutlined/> : <ExpandOutlined/>} 
                    title="Расширить таблицу"
                    onClick={handleHiddenUserInfo}
                />
            </Flex>
            <div style={{
                overflow:'auto',
            }}>
                <Table
                    pagination={false}
                    dataSource={filteredSchedules}
                    columns={memoizedColumns}
                    size="small"
                    rowKey={'id'}
                    loading={loadingSchedules}
                />
            </div>
        </Flex>
    )
});
export default TableData;