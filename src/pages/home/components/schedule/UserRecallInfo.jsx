import React, {useEffect} from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_RECALLS, DELETE_RECALL, ARCHIVE_RECALL } from "../../../../query/RecallQuery";
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

const UserReacllInfo = React.memo(({record}) => {
    const {msgError, msgSuccess} = useCustomMessage()

    const [fetchGetRecall, { data: dataRecall, loading: loadingRecall, error: errorRecall }] 
    = useLazyQuery(GET_RECALLS, {
        fetchPolicy: 'cache-and-network',
    });

    const [deleteRecall, { loading: loadingDeleteRecall, error: errorDeleteRecall }] = useMutation(DELETE_RECALL,{
        refetchQueries: [
            { query: GET_RECALLS },
            { query: GET_SCHEDULES }
        ]
    });

    const [archiveRecall, { loading: loadingArchiveRecall, error: errorArchiveRecall }] = useMutation(ARCHIVE_RECALL,{
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
                <Flex gap={10} justify="space-between" align="center" style={{overflow:'hidden', width:'100%'}}>
                    <Text>Отзыв</Text>-
                    <Text>приказ <span style={{color:'purple'}}>{dataRecall?.getRecalls[0].order}</span>,</Text>
                    с<Text style={{fontStyle:'italic', color:'rgb(100, 194, 172)'}}> {dayjs(dataRecall?.getRecalls[0].startDate).format('DD.MM.YYYY')}</Text>
                    по<Text style={{fontStyle:'italic', color:'rgb(100, 194, 172)'}}> {dayjs(dataRecall?.getRecalls[0].endDate).format('DD.MM.YYYY')},</Text>
                    <Text>статус: 
                        <span style={{color: dataRecall?.getRecalls[0].status ? 'green' : 'orange'}}> {dataRecall?.getRecalls[0].status ? 'выполняется' : 'ожидание'}</span> |
                    </Text>
                    {dataRecall?.getRecalls[0].description && <Text style={{color:'gray'}}>описание: {dataRecall?.getRecalls[0].description}</Text>}
                    <Flex gap={10} style={{marginLeft:'auto'}}>
                        <Text style={{color:'lightgray'}}>создан: {dayjs(dataRecall?.getRecalls[0].createdAt).format('DD.MM.YYYY HH:mm:ss')}</Text>
                        <Text style={{color:'lightgray'}}> {dataRecall?.getRecalls[0].createdBy}</Text>
                    </Flex>
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
                </Flex>
            }
        </Flex>
    )
})

export default UserReacllInfo;