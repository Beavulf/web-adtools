import React, { useCallback, useEffect } from "react";
import {
    Flex,
    Button,
    Popover,
    Popconfirm,
} from 'antd'
import { useMutation } from "@apollo/client/react";
import { DeleteOutlined, FileZipOutlined, HistoryOutlined } from "@ant-design/icons";
import { GET_SCHEDULES, DELETE_SCHEDULE, ARCHIVE_SCHEDULE} from "../../../../query/GqlQuery";
import { useCustomMessage } from "../../../../context/MessageContext";

const RecordAction = React.memo(({record}) => {
    const {msgSuccess, msgError, msgInfo} = useCustomMessage()
    
    const [delelteScheduele, { loading: loadingDeleteSchedule, error: errorDeleteSchedule }] = useMutation(DELETE_SCHEDULE,{
        refetchQueries: [
            { query: GET_SCHEDULES }
        ]
    });
    const [archiveSchedule, { loading: loadingArchiveSchedule, error: errorArchiveSchedule }] = useMutation(ARCHIVE_SCHEDULE,{
        refetchQueries: [
            { query: GET_SCHEDULES }
        ]
    });
    
    useEffect(() => {
        if (errorDeleteSchedule) {
            msgError(`Ошибка при удалении задачи: ${errorDeleteSchedule.message}`);
        }
    },[errorDeleteSchedule])

    useEffect(() => {
        if (errorArchiveSchedule) {
            msgError(`Ошибка при архивировании задачи: ${errorArchiveSchedule.message}`);
        }
    },[errorArchiveSchedule])

    const confirmDelete = useCallback(async () => {
        msgInfo('Удаление записи')
        await delelteScheduele({ variables: { id: record.id } });
    }, [record, delelteScheduele]);

    const confirmArchive = useCallback(async () => {
        msgSuccess(`Запись ${record.cn} отправлена в архив и удалена из расписания`)
        await archiveSchedule({ 
            variables: { 
                id: record.id, 
                shouldArchiveRecall: false 
            } 
        });
    }, [record, archiveSchedule]);

    return (
        <Flex gap={1}>
            <Popover content={<span>Отозвать сотрудника</span>}>
                <Button size="middle" icon={<HistoryOutlined />} style={{color:'green'}}/>
            </Popover>
            <Popover content={<span>Архивировать запись и удалить из расписания</span>}>
                <Popconfirm
                    title="Архивация"
                    description="Архивировать запись и удалить?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={confirmArchive}
                >
                    <Button size="middle" icon={<FileZipOutlined />} style={{color:'orange'}} loading={loadingArchiveSchedule}/>
                </Popconfirm>
            </Popover>
            <Popover content={<span>Удалить запись из расписания</span>}>
                <Popconfirm
                    title="Удаление задачи"
                    description="Удалить запись без архивации?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={confirmDelete}
                >
                    <Button size="middle" icon={<DeleteOutlined />} danger loading={loadingDeleteSchedule}/>
                </Popconfirm>
            </Popover>
            
        </Flex>
    )
});

export default RecordAction;