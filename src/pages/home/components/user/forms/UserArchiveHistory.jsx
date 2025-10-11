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
const {Text} = Typography

const styleInfoBlock = {
    borderRadius:'8px', 
    padding:'5px', 
    backgroundColor:'rgba(243, 243, 243, 0.32)',
    flex:1
}

const UserArchiveHistory = React.memo(({sAMAccountName})=>{
    const [confirmTextValue, setConfirmTextValue] = useState("");
    const deferredConfirmValue = useDeferredValue(confirmTextValue);
    const {msgError} = useCustomMessage()

    const [fetchArchiveSchedules, { data: dataArchiveSchedules, loading: loadingArchiveSchedules, error: errorArchiveSchedules }] 
    = useLazyQuery(GET_ARCHIVE_SCHEDULES, {
        fetchPolicy: 'cache-and-network',
    });

    // Функция для подсчета общего количества дней по массиву записей (например, стажировок)
    const getTotalDays = useCallback((records) => {
        if (!Array.isArray(records)) return 0;
        const days = records.map(obj => {
            const startDate = new Date(obj.startDate);
            const endDate = new Date(obj.endDate);
            const timeDiff = endDate.getTime() - startDate.getTime() + 1;
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        });
        return days.reduce((a, b) => a + b, 0);
    }, []);

    // поулчение статистики по всем типам
    const statsByType = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return {};
        const byType = {};
        for (const type of ['OTPYSK','STAJIROVKA','DEKRET','UCHEBA','PRODLENIE_OTPYSKA','KOMANDIROVKA']) {
            const items = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === type);
            byType[type] = { totalCount: items.length, totalDays: getTotalDays(items) };
        }
        return byType;
    }, [dataArchiveSchedules, getTotalDays]);

    useEffect(()=>{
        fetchArchiveSchedules({variables: {filter: {login: {contains: sAMAccountName}}}});
    },[])

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
            <Flex gap={10} justify="space-between">
                <Flex align="center" vertical gap={2} style={styleInfoBlock}>
                    <Text>Выходов в отпуск - {statsByType.OTPYSK?.totalCount || 0}</Text>
                    <Text>дней в отпуске - {statsByType.OTPYSK?.totalDays || 0}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={styleInfoBlock}>
                    <Text>Выходов на стажировку - {statsByType.STAJIROVKA?.totalCount || 0}</Text>
                    <Text>дней в стажировке - {statsByType.STAJIROVKA?.totalDays || 0}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={styleInfoBlock}>
                    <Text>Выходов в декрет - {statsByType.DEKRET?.totalCount || 0}</Text>
                    <Text>дней в декрете - {statsByType.DEKRET?.totalDays || 0}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={styleInfoBlock}>
                    <Text>Выходов на учебу - {statsByType.UCHEBA?.totalCount || 0}</Text>
                    <Text>дней в учебе - {statsByType.UCHEBA?.totalDays || 0}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={styleInfoBlock}>
                    <Text>Продлений отпуска - {statsByType.PRODLENIE_OTPYSKA?.totalCount || 0}</Text>
                    <Text>дней продления - {statsByType.PRODLENIE_OTPYSKA?.totalDays || 0}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={styleInfoBlock}>
                    <Text>Выходов в командировку - {statsByType.KOMANDIROVKA?.totalCount || 0}</Text>
                    <Text>дней в командировке - {statsByType.KOMANDIROVKA?.totalDays || 0}</Text>
                </Flex>
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