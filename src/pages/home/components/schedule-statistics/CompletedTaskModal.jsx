/**
 * @file CompletedTaskModal.jsx
 * @description Модальное окно для отображения задач и отзывов, выполненных сегодня и завершённых вчера.
 * Используется для статистики завершённых задач в системе WEB AD Tools.
 * 
 * Включает получение данных через GraphQL-запросы, отображение списков задач и отзывов.
 *
 * Использует Ant Design компоненты (Modal, Typography, Flex, List, Button, Popover, Tag) для построения UI.
 * 
 * @author Junior Developer
 */

import React, {useEffect, useMemo, useCallback} from "react";
import {
    Modal,
    Typography,
    Flex,
    List,
    Button,
    Popover,
    Tag
} from 'antd'
import dayjs from "dayjs";
import { useCustomMessage } from "../../../../context/MessageContext";
import { SyncOutlined } from "@ant-design/icons";
import {useSchedule} from '../../../../hooks/api/useSchedule'
import {useRecall} from '../../../../hooks/api/useRecall'

const {Text} = Typography;

// поиск задач выполненых сегодня, без отзыва
const scheduleFilter = {
    filter: { 
        startDate: {equals: dayjs().format('YYYY-MM-DD')},
        status: true,
        isRecall: false
    }
}
// получение отзывов выполненных сегодня
const recallsFilter = {
    filter: { 
        startDate: {equals: dayjs().format('YYYY-MM-DD')},
        status: true
    }
}
// получение задач каоторые завершили свое выполнение сегодня
const archiveScheduleFilter = {
    filter: { 
        endDate: {equals: dayjs().subtract(1, 'day').format('YYYY-MM-DD')},
        status: true,
    }
}
// получение отзывов каоторые завершили свое выполнение сегодня
const archiveRecallsFilter = {
    filter: { 
        endDate: {equals: dayjs().subtract(1, 'day').format('YYYY-MM-DD')},
    }
}

const CompletedTaskModal = React.memo(({isOpen, onCancel})=>{
    const {msgError} = useCustomMessage();
    const {
        actions: actionsSchedule, 
        loading: loadingSchedules, 
        fetchSchedulesData, 
        fetchFioArchiveScheduleData, 
        fetchFioScheduleData,
        fetchArchiveSchedulesData
    } = useSchedule({onError: (error)=> msgError(`Ошибка при загрузке выполненных задач: ${error.message}`)});
    const {
        actions: actionsRecall, 
        loading: loadingRecall, 
        fetchRecallsData, 
        fetchArchiveRecallsData,
        fetchArchiveRecalls
    } = useRecall({onError: (error)=> msgError(`Ошибка при загрузке отзывов:${error.message}`)});

    // для обьеденение массивов с найденным данными из разных запросов
    const allSchedule = useMemo(()=>{
        return [...fetchSchedulesData || [], ...fetchArchiveSchedulesData || []]
    },[fetchSchedulesData, fetchArchiveSchedulesData]);
    const allRecalls = useMemo(()=>{
        return [...fetchRecallsData || [], ...fetchArchiveRecalls || []]
    },[fetchRecallsData, fetchArchiveRecalls]);

    // для получения всех задачи и отзывов
    const handleFetchData = async () => {
        await actionsSchedule.fetchSchedules({variables: scheduleFilter});
        await actionsRecall.fetchRecalls({variables: recallsFilter})
        await actionsSchedule.fetchArchiveSchedules({variables: archiveScheduleFilter});
        await actionsRecall.fetchArchiveRecalls({variables: archiveRecallsFilter});
    }

    // получение фио для отзывов архивных
    const handleFetchFioForArchiveRecalls = async () => {
        const scheduleIds = fetchArchiveRecallsData.map(item => item.scheduleId);
        if (!scheduleIds) return;
        try {
            await actionsSchedule.fetchFioSchedule({variables: {filter:{id:{in:scheduleIds}}}});
            await actionsSchedule.fetchFioArchiveSchedule({variables: {filter:{id:{in:scheduleIds}}}});
        }
        catch(err){
            msgError(`Ошибка при получении ФИО для отзывов: ${err.message}`)
        }
    }
    
    useEffect(()=>{
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                await handleFetchData();
            }
            catch(err) {
                msgError(`Ошибка при загрузке выполненных задач: ${err.message}`)
            }
        }
        fetchData();
    },[isOpen])
    
    // для отображения фио в списке после прогрузки всего
    useEffect(() => {
        if (!isOpen) return;
        handleFetchFioForArchiveRecalls();
    }, [isOpen, fetchArchiveRecallsData]);

    const ListItemSchedules = useCallback((item) => {
        const isStart = dayjs(item.startDate).format('DD.MM.YYYY') === dayjs().format('DD.MM.YYYY');
        return (
            <List.Item>
                <List.Item.Meta
                    avatar={
                        <Tag color={isStart ? 'green' : 'orange'}>{isStart ? 'старт' : 'конец'}</Tag>
                    }
                    title={<Text>{item.fio} ({item.login})</Text>}
                    description={
                        <Flex align="center" gap={10}>
                            <span>{item.order}</span> -
                            <span>{dayjs(item.startDate).format('DD.MM.YYYY')} по {dayjs(item.endDate).format('DD.MM.YYYY')}</span>
                            <span>(созд. {item.createdBy})</span>
                        </Flex>
                    }
                />
            </List.Item>
        )
    },[]);

    const ListItemRecalls = useCallback((item) => {
        const isStart = dayjs(item.startDate).format('DD.MM.YYYY') === dayjs().format('DD.MM.YYYY');
        const fioAndLogin = item?.schedule || 
            fetchFioArchiveScheduleData.find(row => row.id === item.scheduleId) || 
            fetchFioScheduleData.find(row => row.id === item.scheduleId);
        return (
            <List.Item>
                <List.Item.Meta
                    avatar={
                        <Tag color={isStart ? 'green' : 'orange'}>{isStart ? 'старт' : 'конец'}</Tag>
                    }
                    title={
                        <Text>{fioAndLogin?.fio || 'Архивированнный'} ({fioAndLogin?.login || 'Архивированнный'})</Text>
                    }
                    description={
                        <Flex align="center" gap={10}>
                            <span>Отзыв {item.order}</span> -
                            <span>{dayjs(item.startDate).format('DD.MM.YYYY')} по {dayjs(item.endDate).format('DD.MM.YYYY')}</span>
                            <span>(созд. {item.createdBy})</span>
                        </Flex>                        
                    }
                />
            </List.Item>
        )
    },[fetchFioArchiveScheduleData, fetchFioScheduleData]);
    
    const ListHeader = ({text}) => {
        return (
            <Flex align="center" justify="space-between">
                <Text>{text}</Text>
            </Flex>
        )
    };

    return (
        <Modal
            title={
                <Flex align="center" gap={10}>
                    <Text>Список выполненных задач</Text>
                    <Popover content={<Text>Синхронизировать данные с БД</Text>}>
                        <Button 
                            loading={Object.values(loadingSchedules).some(Boolean) || Object.values(loadingRecall).some(Boolean)} 
                            onClick={handleFetchData} 
                            icon={<SyncOutlined/>}>обновить
                        </Button>
                    </Popover>
                </Flex>
            }
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            width={1200}
            destroyOnHidden
            style={{overflow:'auto'}}
        >
            <Flex gap={10}>
                <List
                    header={<ListHeader text="Основные задачи"/>}
                    bordered
                    dataSource={allSchedule}
                    renderItem={ListItemSchedules}
                    style={{maxHeight:'700px', overflow:'auto', flex:1, }}
                    loading={Object.values(loadingSchedules).some(Boolean)}
                />
                <List
                    header={<ListHeader text="Отзывы"/>}
                    bordered
                    dataSource={allRecalls}
                    renderItem={ListItemRecalls}
                    style={{maxHeight:'700px', overflow:'auto', flex:1, }}
                    loading={Object.values(loadingRecall).some(Boolean)}                   
                />
            </Flex>
        </Modal>
    )
})

export default CompletedTaskModal;