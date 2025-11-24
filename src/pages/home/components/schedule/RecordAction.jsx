/**
 * RecordAction компонент отвечает за отображение действий с записью в расписании — удаление, архивация, отзыв.
 * Использует Ant Design компоненты для диалогов подтверждения и кнопок, а также кастомный хук useSchedule для работы с API расписаний.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.record - объект записи расписания (schedule), для которой выводятся действия
 * 
 * Варианты действий:
 * - Удалить запись (удаление без архивации)
 * - Архивировать запись (отправить в архив и удалить из активного расписания)
 * - Открыть модальное окно для создания отзыва (отправление сотрудника в отпуск и т.д.)
 * 
 * Вспомогательные функции:
 * - confirmDelete — обработка подтверждения удаления
 * - confirmArchive — обработка подтверждения архивации
 * - TriggerOpenModalRecall — отображение кнопки и модального окна для создания отзыва 
 *
 * @example
 * <RecordAction record={scheduleRecord} />
 */
import React, {  } from "react";
import {
    Flex,
    Button,
    Popover,
    Popconfirm,
} from 'antd'
import { DeleteOutlined, FileZipOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../context/MessageContext";
import { useSchedule } from "../../../../hooks/api/useSchedule";
import TriggerOpenModalRecall from "./TriggerOpenModalRecall";

const RecordAction = React.memo(({record}) => {
    const {msgSuccess, msgError, msgWarning} = useCustomMessage()
    const {actions, loading} = useSchedule({
        // onError: (error) => msgError(`Ошибка выполнения действия: ${error.message}`)
    });

    // подтверждение удаления записи без арзивации
    const confirmDelete = async () => {
        try {
            await actions.deleteSchedule(record.id);
            msgSuccess('Запись удалена.')
        }
        catch(error) {
            msgError(`Ошибка при удалении: ${error.message}.`);
        }
    };

    // подтверждение архивации записи и удаления из расписания
    const confirmArchive = async () => {
        try {
            await actions.archiveSchedule({ 
                id: record.id, 
                shouldArchiveRecall: true 
            });
            msgSuccess(`Запись отправлена в архив и удалена из расписания.`)
        }
        catch(error) {
            msgError(`Ошибка при архивировании: ${error.message}.`);
        }
    };

    return (
        <Flex gap={1}>
            <TriggerOpenModalRecall record={record} msgWarning={msgWarning}/>
            <Popover content={<span>Архивировать запись и удалить из расписания</span>}>
                <Popconfirm
                    title="Архивация"
                    description="Архивировать запись и удалить?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={confirmArchive}
                >
                    <Button size="middle" icon={<FileZipOutlined />} style={{color:'orange'}} loading={loading.archive}/>
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
                    <Button size="middle" icon={<DeleteOutlined />} danger loading={loading.delete}/>
                </Popconfirm>
            </Popover>
        </Flex>
    )
});

export default RecordAction;