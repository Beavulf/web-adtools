import React, {useState, useEffect} from "react";
import {
    Modal,
    Typography,
    Flex,
    List,
    Input,
    Button
} from 'antd'
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../context/MessageContext";
import { useLazyQuery } from "@apollo/client/react";
import { GET_SCHEDULES_FILTER } from "../../../../query/GqlQuery";
import { GET_RECALLS } from "../../../../query/RecallQuery";
import { GET_ARCHIVE_SCHEDULES } from "../../../../query/GqlQuery";
import { GET_ARCHIVE_RECALLS } from "../../../../query/RecallQuery";

const {Text} = Typography;
const {Search} = Input;
// поиск задач выполненых сегодня, без отзыва
const scheduleFilter = {
    filter: { 
        startDate: {equals: dayjs().format('YYYY-MM-DD')},
        status: true,
        isRecall: false
    }
}
const recallsFilter = {
    filter: { 
        startDate: {equals: dayjs().format('YYYY-MM-DD')},
        status: true
    }
}
const archiveScheduleFilter = {
    filter: { 
        endDate: {equals: dayjs().subtract(1, 'day').format('YYYY-MM-DD')},
        status: true,
    }
}
const archiveRecallsFilter = {
    filter: { 
        endDate: {equals: dayjs().subtract(1, 'day').format('YYYY-MM-DD')},
    }
}

const CompletedTaskModal = React.memo(({isOpen, onCancel})=>{
    const {msgError} = useCustomMessage();

    const [fetchSchedules, {data: dataSchedules}] = useLazyQuery(GET_SCHEDULES_FILTER, {
        fetchPolicy: 'cache-and-network',
    });
    const [fetchRecalls, {data: dataRecalls}] = useLazyQuery(GET_RECALLS,{
        fetchPolicy: 'cache-and-network',
    });
    const [fetchArchiveSchedules, {data: dataArchiveSchedules}] = useLazyQuery(GET_ARCHIVE_SCHEDULES,{
        fetchPolicy: 'cache-and-network',
    });
    const [fetchArchiveRecalls, {data: dataArchiveRecalls}] = useLazyQuery(GET_ARCHIVE_RECALLS,{
        fetchPolicy: 'cache-and-network',
    });

    const handleClickToFetch = async () => {
        await fetchSchedules({variables: scheduleFilter});
        await fetchRecalls({variables: recallsFilter})
        await fetchArchiveSchedules({variables: archiveScheduleFilter});
        await fetchArchiveRecalls({variables: archiveRecallsFilter});
        console.log(dataSchedules);
        console.log(dataRecalls);
        console.log(dataArchiveSchedules);
        console.log(dataArchiveRecalls);
    }

    useEffect(()=>{
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                await fetchSchedules({variables: scheduleFilter});
                await fetchRecalls({variables: recallsFilter})
            }
            catch(err) {
                msgError(`Ошибка при загрузке выполненных задач: ${err.message}`)
            }
        }
        fetchData();
    },[isOpen])
    

    const CompletedListItem = (item) => {
        return (
            <List.Item>
                <List.Item.Meta
                    avatar={<UserOutlined/>}
                    title={<Text>{item}</Text>}
                />
            </List.Item>
        )
    }

    return (
        <Modal
            title={<Text>Список выполненных задач</Text>}
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            width={1200}
            destroyOnHidden
            style={{overflow:'auto'}}
        >
            <List
                header={<Text>HEADER <Button onClick={handleClickToFetch}>LOG</Button></Text>}
                bordered
                // dataSource={fileNotFoundData}
                renderItem={CompletedListItem}
                style={{maxHeight:'700px', overflow:'auto'}}
            />
        </Modal>
    )
})

export default CompletedTaskModal;