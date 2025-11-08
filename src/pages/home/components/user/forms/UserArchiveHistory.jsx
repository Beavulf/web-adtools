import React, {useState, useMemo, useDeferredValue, useEffect} from "react";
import { 
    Button,
    Flex,
    Table,
    Popover,
    Input,
    Typography,
    Modal
} from "antd"
import { SyncOutlined } from "@ant-design/icons";
import { GET_ARCHIVE_SCHEDULES } from "../../../../../query/GqlQuery";
import { useLazyQuery } from "@apollo/client/react";
import scheduleColumns from "../../schedule/ScheduleColumns";
import { useCustomMessage } from "../../../../../context/MessageContext";
import useArchiveStatistics from '../../../../../hooks/user/useArchiveStatistics'
import filterSchedules from '../../../../../utils/filterSchedules'
import UserReacllInfo from "../../schedule/UserRecallInfo";

const {Search} = Input
const {Text} = Typography

const styleInfoBlock = {
    borderRadius:'8px', 
    padding:'5px', 
    backgroundColor:'rgba(243, 243, 243, 0.32)',
    flex:1
}

const UserArchiveHistory = React.memo(({sAMAccountName, isOpen, onCancel})=>{
    const [confirmTextValue, setConfirmTextValue] = useState("");
    const deferredConfirmValue = useDeferredValue(confirmTextValue);
    const {msgError} = useCustomMessage()
    // true потому что архивные записи (не будут отображаться кнопки действий)
    const columns = scheduleColumns(true);

    const [fetchArchiveSchedules, { data: dataArchiveSchedules, loading: loadingArchiveSchedules }] 
    = useLazyQuery(GET_ARCHIVE_SCHEDULES, {
        fetchPolicy: 'cache-and-network',
    });

    // получение статистики по типу задач
    const statsByType = useArchiveStatistics(dataArchiveSchedules?.getArchiveSchedules);

    const handleFetchArchiveSchedules = async () => {
        try {
            setConfirmTextValue('');
            await fetchArchiveSchedules({variables: {filter: {login: {contains: sAMAccountName}}}});
        }
        catch(err) {
            setConfirmTextValue('');
            msgError(err.message)
        }
    }

    useEffect(()=>{
        if (!isOpen) return;
        const fetchData = async () => {
            await handleFetchArchiveSchedules();
        }
        fetchData()
    },[isOpen, sAMAccountName])

    const handleSearch = (value) => {
        setConfirmTextValue(value);
    }

    // фильтрация таблицы
    const filteredSchedules = useMemo(() => {
        return filterSchedules(dataArchiveSchedules?.getArchiveSchedules, deferredConfirmValue);
    }, [dataArchiveSchedules, deferredConfirmValue]);

    
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
                    <Button type="" style={{color:'gray'}}>{dataArchiveSchedules?.getArchiveSchedules?.length}</Button>
                </Popover>
                <Search 
                    placeholder="Поиск по ФИО, логину, датам (гггг-мм-дд), приказу, описанию..."
                    onSearch={handleSearch}
                    allowClear  
                />
                <Popover content={<span>Обновить таблицу</span>}>
                    <Button 
                        onClick={handleFetchArchiveSchedules} 
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
                columns={columns}
                size="middle"
                rowKey={'id'}
                loading={loadingArchiveSchedules}
                scroll={{y:'600px'}}
                expandable={{
                    expandedRowRender: (record) => <UserReacllInfo record={record} isArchive={true}/>,
                }}
            />
        </Flex>
        </Modal>
    )
})

export default UserArchiveHistory;