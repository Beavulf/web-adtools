import React, { useCallback, useState } from "react";
import {
    Flex,
    Button,
    Popover,
    Popconfirm,
    Modal
} from 'antd'
import { useMutation } from "@apollo/client/react";
import { DeleteOutlined, FileZipOutlined, HistoryOutlined } from "@ant-design/icons";
import { GET_SCHEDULES, DELETE_SCHEDULE, ARCHIVE_SCHEDULE} from "../../../../query/GqlQuery";
import { useCustomMessage } from "../../../../context/MessageContext";
import RecallModal from "./RecallModal";

const RecordAction = React.memo(({record}) => {
    const {msgSuccess, msgError} = useCustomMessage()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    
    const [deleteSchedule, { loading: loadingDeleteSchedule, error: errorDeleteSchedule }] = useMutation(DELETE_SCHEDULE,{
        refetchQueries: [
            { query: GET_SCHEDULES }
        ]
    });
    const [archiveSchedule, { loading: loadingArchiveSchedule, error: errorArchiveSchedule }] = useMutation(ARCHIVE_SCHEDULE,{
        refetchQueries: [
            { query: GET_SCHEDULES }
        ]
    });

    // подтверждение удаления записи без арзивации
    const confirmDelete = useCallback(async () => {
        try {
            await deleteSchedule({ variables: { id: record.id } });
            msgSuccess('Удаление записи')
        }
        catch(error) {
            msgError(`Ошибка при удалении: ${error.message}`);
        }
    }, [record.id, deleteSchedule, msgSuccess, msgError]);

    // подтверждение архивации записи и удаления из расписания
    const confirmArchive = useCallback(async () => {
        try {
            await archiveSchedule({ 
                variables: { 
                    id: record.id, 
                    shouldArchiveRecall: false 
                } 
            });
            msgSuccess(`Запись отправлена в архив и удалена из расписания`)
        }
        catch(error) {
            msgError(`Ошибка при архивировании: ${error.message}`);
        }
    }, [record, archiveSchedule, msgSuccess, msgError]);

    return (
        <Flex gap={1}>
            <Popover content={<span>Отозвать сотрудника</span>}>
                <Button 
                    size="middle" 
                    icon={<HistoryOutlined />} 
                    style={{color:'green'}}
                    onClick={handleModalOpen}
                />
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
            
            <RecallModal isOpen={isModalOpen} onCancel={handleModalClose} record={record}/>

        </Flex>
    )
});

export default RecordAction;