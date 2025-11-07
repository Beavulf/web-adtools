import React, {} from "react";
import {
    Flex,
    Button,
    Popover,
    Popconfirm,
    Typography
} from 'antd'
import { useMutation } from "@apollo/client/react";
import { DeleteOutlined, FileZipOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../../../context/MessageContext"
import { DELETE_ONETIME_TASK, GET_ONETIME_TASKS, ARCHIVE_ONETINE_TASK } from "../../../../../../query/OneTimeQuery";

const {Text} = Typography;

const RecordAction = React.memo(({record}) => {
    const {msgSuccess, msgError} = useCustomMessage();

    const [deleteOneTime, {loading: loadingDeleteOneTime}] = useMutation(DELETE_ONETIME_TASK, {
        refetchQueries: [
            { query: GET_ONETIME_TASKS, variables: { filter: {} }}
        ],
        awaitRefetchQueries: true,
    });

    const [archiveOneTime, {loading: loadingArchiveOneTime}] = useMutation(ARCHIVE_ONETINE_TASK, {
        refetchQueries: [
            { query: GET_ONETIME_TASKS, variables: { filter: {} }}
        ],
        awaitRefetchQueries: true,
    });

    const handleDeleteOneTime = async () => {
        try {
            await deleteOneTime({variables: {id: record.id}})
            msgSuccess('Задача удалена')
        }
        catch(err) {
            msgError(err.message)
        }
    }

    const handleArchiveOneTime = async () => {
        try {
            await archiveOneTime({variables: {id: record.id}})
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
                        <Button size="middle" icon={<FileZipOutlined />} loading={loadingArchiveOneTime}></Button>
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
                        <Button size="middle" icon={<DeleteOutlined />} danger loading={loadingDeleteOneTime}></Button>
                </Popconfirm>
            </Popover>
        </Flex>
    )
});

export default RecordAction;