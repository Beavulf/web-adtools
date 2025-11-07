import React, {useEffect} from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { 
    GET_RECALLS, 
    DELETE_RECALL, 
    ARCHIVE_RECALL,
    GET_ARCHIVE_RECALLS
} from "../../../../query/RecallQuery";
import { GET_SCHEDULES } from "../../../../query/GqlQuery";
import {
    Flex,
    Typography,
    Button,
    Popconfirm
} from 'antd'
import dayjs from "dayjs";
import { DeleteOutlined, FileZipOutlined, LoadingOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../context/MessageContext";

const {Text} = Typography;

const UserReacllInfo = React.memo(({record, isArchive = false}) => {
    const {msgError, msgSuccess} = useCustomMessage()

    const [fetchGetRecall, { data: dataRecall, loading: loadingRecall }] 
    = useLazyQuery(isArchive ? GET_ARCHIVE_RECALLS : GET_RECALLS, {
        fetchPolicy: 'cache-and-network',
    });

    const [deleteRecall, { loading: loadingDeleteRecall }] = useMutation(DELETE_RECALL,{
        refetchQueries: [
            { query: GET_RECALLS },
            { query: GET_SCHEDULES }
        ]
    });

    const [archiveRecall, { loading: loadingArchiveRecall }] = useMutation(ARCHIVE_RECALL,{
        refetchQueries: [
            { query: GET_RECALLS },
            { query: GET_SCHEDULES }
        ]
    })

    useEffect(() => {
        if (record) {
            try{
                fetchGetRecall({variables: {filter: {scheduleId: {contains: record.id}}}});
            }
            catch(err) {
                msgError(err.message);
            }
        }
    },[record, fetchGetRecall])

    // удаление отзыва
    const handleDelteRecall = async () => {
        try {
            await deleteRecall({variables: {id: dataRecall?.getRecalls[0].id}});
            msgSuccess('Отзыв успешно удален');
        }
        catch(err) {
            msgError(err.message);
        }
    }

    // архивация отзыва и удаление из расписания
    const handleArchiveRecall = async ()=> {
        try {
            await archiveRecall({variables: {id: dataRecall?.getRecalls[0].id}});
            msgSuccess('Отзыв успешно отправлен в архив и удален из расписания');
        }
        catch(err) {
            msgError(err.message);
        }
    }

    return (
        <Flex justify={loadingRecall ? 'center' : ''}>
            {loadingRecall ? <LoadingOutlined/>:
                dataRecall?.[isArchive ? 'getArchiveRecalls' : 'getRecalls']?.map((recall)=>{
                    return (
                        <Flex key={recall.id} gap={10} justify="space-between" align="center" style={{overflow:'hidden', width:'100%'}}>
                            <Text>Отзыв</Text>-
                            <Text>приказ <span style={{color:'purple'}}>{recall.order}</span>,</Text>
                            с<Text style={{fontStyle:'italic', color:'rgb(100, 194, 172)'}}> {dayjs(recall.startDate).format('DD.MM.YYYY')}</Text>
                            по<Text style={{fontStyle:'italic', color:'rgb(100, 194, 172)'}}> {dayjs(recall.endDate).format('DD.MM.YYYY')},</Text>
                            <Text>статус: 
                                <span style={{color: recall.status ? 'green' : 'orange'}}> {recall.status ? 'выполняется' : 'ожидание'}</span> |
                            </Text>
                            {recall.description && <Text style={{color:'gray'}}>описание: {recall.description}</Text>}
                            <Flex gap={10} style={{marginLeft:'auto'}}>
                                <Text style={{color:'lightgray'}}>создан: {dayjs(recall.createdAt).format('DD.MM.YYYY HH:mm:ss')}</Text>
                                <Text style={{color:'lightgray'}}> {recall.createdBy}</Text>
                            </Flex>
                            {isArchive ? null: 
                                <Flex gap={2}>
                                    <Popconfirm
                                        title="Архивирование"
                                        description="Архивировать отзыв и удалить?"
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={handleArchiveRecall}
                                    >
                                        <Button loading={loadingArchiveRecall} style={{color:'orange'}} icon={<FileZipOutlined />} size="small" title="Архивировать отзыв и удалить из расписания"></Button>
                                    </Popconfirm>
                                    <Popconfirm
                                        title="Удаление отзыва"
                                        description="Удалить отзыв без архивации?"
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={handleDelteRecall}
                                    >
                                        <Button loading={loadingDeleteRecall} icon={<DeleteOutlined />} size="small" danger title="Удалить запись отзыва"></Button>
                                    </Popconfirm>
                                </Flex>
                            }
                        </Flex>
                    )
                })
            }
        </Flex>
    )
})

export default UserReacllInfo;