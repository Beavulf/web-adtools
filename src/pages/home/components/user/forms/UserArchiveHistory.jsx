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
    
    const allCountOtpysk = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'OTPYSK').length;
    }, [dataArchiveSchedules]);

    const allTimeInOtpysk = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const otpyska = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'OTPYSK')
        return getTotalDays(otpyska)
    },[dataArchiveSchedules])
    // Расчет количества и дней для всех типов отпусков
    const allCountStazhirovka = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'STAJIROVKA').length;
    }, [dataArchiveSchedules]);

    const allTimeInStazhirovka = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const stazhirovki = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'STAJIROVKA');
        return getTotalDays(stazhirovki)
    }, [dataArchiveSchedules]);

    const allCountProdlenieOtpyska = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'PRODLENIE_OTPYSKA').length;
    }, [dataArchiveSchedules]);

    const allTimeInProdlenieOtpyska = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const prodleniya = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'PRODLENIE_OTPYSKA');
        return getTotalDays(prodleniya)
    }, [dataArchiveSchedules]);

    const allCountKomandirovka = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'KOMANDIROVKA').length;
    }, [dataArchiveSchedules]);

    const allTimeInKomandirovka = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const komandirovki = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'KOMANDIROVKA');
        return getTotalDays(komandirovki)
    }, [dataArchiveSchedules]);

    const allCountUcheba = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'UCHEBA').length;
    }, [dataArchiveSchedules]);

    const allTimeInUcheba = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const ucheba = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'UCHEBA');
        return getTotalDays(ucheba)
    }, [dataArchiveSchedules]);

    const allCountDekret = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        return dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'DEKRET').length;
    }, [dataArchiveSchedules]);

    const allTimeInDekret = useMemo(() => {
        if (!dataArchiveSchedules?.getArchiveSchedules) return 0;
        const dekrety = dataArchiveSchedules.getArchiveSchedules.filter(obj => obj.type === 'DEKRET');
        return getTotalDays(dekrety)
    }, [dataArchiveSchedules]);

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
            <Flex gap={10} justify="space-between">
                <Flex align="center" vertical gap={2} style={{ borderRadius:'8px', padding:'5px', backgroundColor:'rgba(225, 224, 221, 0.17)'}}>
                    <Text>Всего выходов в отпуск - {allCountOtpysk}</Text>
                    <Text>дней в отпуске - {allTimeInOtpysk}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={{ borderRadius:'8px', padding:'5px', backgroundColor:'rgba(225, 224, 221, 0.17)'}}>
                    <Text>Всего выходов на стажировку - {allCountStazhirovka}</Text>
                    <Text>дней в стажировке - {allTimeInStazhirovka}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={{ borderRadius:'8px', padding:'5px', backgroundColor:'rgba(225, 224, 221, 0.17)'}}>
                    <Text>Всего выходов в декрет - {allCountDekret}</Text>
                    <Text>дней в декрете - {allTimeInDekret}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={{ borderRadius:'8px', padding:'5px', backgroundColor:'rgba(225, 224, 221, 0.17)'}}>
                    <Text>Всего выходов на учебу - {allCountUcheba}</Text>
                    <Text>дней в учебе - {allTimeInUcheba}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={{ borderRadius:'8px', padding:'5px', backgroundColor:'rgba(225, 224, 221, 0.17)'}}>
                    <Text>Всего продлений отпуска - {allCountProdlenieOtpyska}</Text>
                    <Text>дней продления - {allTimeInProdlenieOtpyska}</Text>
                </Flex>
                <Flex align="center" vertical gap={2} style={{ borderRadius:'8px', padding:'5px', backgroundColor:'rgba(225, 224, 221, 0.17)'}}>
                    <Text>Всего выходов в командировку - {allCountKomandirovka}</Text>
                    <Text>дней в командировке - {allTimeInKomandirovka}</Text>
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