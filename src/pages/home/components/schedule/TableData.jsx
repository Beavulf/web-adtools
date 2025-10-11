import React, { useEffect, useState, useCallback, useMemo, useDeferredValue, startTransition, Suspense } from "react";
import {
    Flex,
    Input,
    Table,
    Button,
    Popover,
    Radio
} from 'antd'
import { SyncOutlined, ExpandOutlined, CompressOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import scheduleColumns from "./ScheduleColumns";
import { GET_SCHEDULES } from "../../../../query/GqlQuery";
import UserReacllInfo from "./UserRecallInfo";

const {Search} = Input

const TableData = React.memo(({onError, onHidden, searchValue})=> {
    const [confirmTextValue, setConfirmTextValue] = useState("");
    const [hiddenUserInfo, setHiddenUserInfo] = useState(false)
    const [filteredSchedules, setFilteredSchedules] = useState([]);
   
    const deferredConfirmValue = useDeferredValue(confirmTextValue);
    
    // получение списка задач из БД
    const {data: dataSchedules, loading: loadingSchedules, error: errorSchedules, refetch} = useQuery(GET_SCHEDULES, {
        pollInterval: 1200000,
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        startTransition(() => {
          if (searchValue) setConfirmTextValue(searchValue);
          else setConfirmTextValue("");
        });
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

    const handleSearch = useCallback(value => {
        startTransition(() => setConfirmTextValue(value));
    }, []);

    // фильтруем данные
    useEffect(() => {
        if (!dataSchedules?.getSchedules) return;
        const handler = setTimeout(() => {
          if (!deferredConfirmValue.trim()) {
            setFilteredSchedules(dataSchedules.getSchedules);
          } else {
            const searchLower = deferredConfirmValue.toLowerCase();
            const filtered = dataSchedules.getSchedules.filter(obj =>
              ['fio', 'login', 'order', 'createdAt', 'updatedAt', 'description', 'startDate', 'endDate']
                .some(key => {
                  const value = obj[key];
                  return value && String(value).toLowerCase().includes(searchLower);
                })
            );
            setFilteredSchedules(filtered);
          }
        }, 0);
        return () => clearTimeout(handler);
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
                <Suspense>
                    <Table
                        pagination={false}
                        dataSource={filteredSchedules}
                        columns={memoizedColumns}
                        size="small"
                        rowKey={'id'}
                        loading={loadingSchedules}
                        expandable={{
                            expandedRowRender: (record) => <UserReacllInfo record={record}/>,
                            rowExpandable: record => record.isRecall === true,
                        }}
                    />
                </Suspense>
            </div>
        </Flex>
    )
});
export default TableData;