import React, {useState, useCallback, useMemo, useDeferredValue, useEffect} from "react";
import { 
    Button,
    Flex,
    Table,
    Popover,
    Input,
    Typography
} from "antd"
import { SyncOutlined } from "@ant-design/icons";
import { GET_ARCHIVE_SCHEDULES } from "../../../../../query/GqlQuery";
import { useLazyQuery } from "@apollo/client/react";
import scheduleColumns from "../../schedule/ScheduleColumns";
import { useCustomMessage } from "../../../../../context/MessageContext";

const {Search} = Input
const {Text, Paragraph} = Typography

const UserArchiveHistory = React.memo(({sAMAccountName})=>{
    const [confirmTextValue, setConfirmTextValue] = useState("");
    const deferredConfirmValue = useDeferredValue(confirmTextValue);
    const {msgError} = useCustomMessage()

    const [fetchArchiveSchedules, { data: dataArchiveSchedules, loading: loadingArchiveSchedules, error: errorArchiveSchedules }] 
    = useLazyQuery(GET_ARCHIVE_SCHEDULES, {
        
        fetchPolicy: 'cache-and-network',
    });
    
    const allCountOtpysk = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'OTPYSK').length;
    }, [dataArchiveSchedules]);

    const allTimeInOtpysk = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const otpyska = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'OTPYSK')
        const days = otpyska.map(obj => {
            const startDate = new Date(obj.startDate);
            const endDate = new Date(obj.endDate);
            const timeDiff = endDate.getTime() - startDate.getTime() +1;
            const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return days;
        });
        return days.reduce((a, b) => a + b, 0);
    
    },[dataArchiveSchedules])

    useEffect(()=>{
        fetchArchiveSchedules({variables: {filter: {login: {contains: sAMAccountName}}}});
    },[sAMAccountName])

    useEffect(() => {
        if (errorArchiveSchedules) msgError(errorArchiveSchedules?.message);
    }, [errorArchiveSchedules]);

    const handleSearch = useCallback((value) => {
        setConfirmTextValue(value);
    }, []);

    const filteredSchedules = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return [];
        if (!deferredConfirmValue.trim()) return dataArchiveSchedules.getArchiveSchedules;
        
        const searchLower = deferredConfirmValue.toLowerCase();
        return dataArchiveSchedules.getArchiveSchedules.filter(obj =>
            ['fio', 'login', 'order', 'createdAt', 'updatedAt', 'description', 'startDate', 'endDate'].some(
                key => {
                    const value = obj[key];
                    return value && String(value).toLowerCase().includes(searchLower);
                }
            )
        );
    }, [dataArchiveSchedules, deferredConfirmValue]);

    const memoizedColumns = useMemo(() => scheduleColumns, []);

    return (
        <Flex vertical gap={10}>
            <Flex gap={5}>
                <Popover content={<span>Строк в таблице</span>}>
                    <Button type="" style={{color:'gray'}}>{dataArchiveSchedules?.getArchiveSchedules?.length}</Button>
                </Popover>
                <Search 
                    placeholder="Поиск по ФИО, логину, датам (гггг-мм-дд), приказу, описанию..."
                    onSearch={handleSearch}
                    allowClear  
                />
                <Popover content={<span>Обновить таблицу</span>}>
                    <Button 
                        onClick={() => fetchArchiveSchedules({variables: {filter: {login: {contains: sAMAccountName}}}})} 
                        disabled={loadingArchiveSchedules} 
                        icon={<SyncOutlined 
                        spin={loadingArchiveSchedules}/>} 
                        title="Обновить таблицу"
                    />
                </Popover>
            </Flex>
            <Flex>
                <Text>Всего выходов в отпуск - {allCountOtpysk}</Text>
                <Text>дней в отпуске - {allTimeInOtpysk}</Text>
            </Flex>
            <Table
                pagination={false}
                dataSource={filteredSchedules}
                columns={memoizedColumns}
                size="middle"
                rowKey={'id'}
                loading={loadingArchiveSchedules}
                scroll={{y:'600px'}}
            />
        </Flex>
    )
})

export default UserArchiveHistory;