/**
 * @component RecordAction
 * @description
 * Кнопки для управления одной разовой задачей сотрудника: Архивирование и Удаление.
 * Используется внутри таблицы разовых задач. Показывает действия (иконки) с подтверждением.
 * 
 * @example
 * <RecordAction record={rowData} />
 * 
 * Использует Ant Design (Flex, Popover, Popconfirm, Button), кастомные хуки для мутаций.
 * Показывает всплывающие подсказки и сообщения о результате действия.
 */


import React from "react";
import {
    Flex,
    Button,
    Popover,
    Popconfirm,
    Typography
} from 'antd'
import { DeleteOutlined, FileZipOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../../../context/MessageContext"
import { useOneTime } from "../../../../../../hooks/api/useOneTime";

const {Text} = Typography;

const RecordAction = React.memo(({record}) => {
    const {msgSuccess, msgError} = useCustomMessage();
    const {actions, loading} = useOneTime({
        onError: (error) => msgError(`Ошибка при работе с Разовыми задачами: ${error.message || error}`)
    })

    const handleDeleteOneTime = async () => {
        try {
            await actions.deleteOneTime(record.id)
            msgSuccess('Задача удалена')
        }
        catch(err) {
            msgError(err.message)
        }
    }

    const handleArchiveOneTime = async () => {
        try {
            await actions.archiveOneTime(record.id)
            msgSuccess('Задача перемещена в архив')
        }
        catch(err) {
            msgError(err.message)
        }
    }

    return (
        <Flex justify="center" gap={2}>
            <Popover content={<Text>Архивирование записи</Text>}>
                <Popconfirm
                    title="Архивирование"
                    description="Архивировать разовую задачу и удалить из расписания?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={handleArchiveOneTime}
                >
                    <Button size="middle" icon={<FileZipOutlined />} loading={loading.archive}></Button>
                </Popconfirm>
            </Popover>
            <Popover content={<Text>Удаление записи из расписания</Text>}>
                <Popconfirm
                    title="Удаление"
                    description="Удалить разовую задачу из расписания?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={handleDeleteOneTime}
                >
                    <Button size="middle" icon={<DeleteOutlined />} danger loading={loading.delete}></Button>
                </Popconfirm>
            </Popover>
        </Flex>
    )
});

export default RecordAction;