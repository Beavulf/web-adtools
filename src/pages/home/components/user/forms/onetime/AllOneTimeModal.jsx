/**
 * AllOneTimeModal.jsx
 * 
 * @component
 * Модальное окно для отображения всех АКТИВНЫХ разовых задач пользователя.
 * Отображает таблицу с задачами, колонками из OneTimeColumns, загрузку и кнопку.
 * Загружает данные через кастомный хук useOneTime.
 * 
 * Используемые библиотеки: Ant Design (Modal, Table, Button, Skeleton, Flex), React, context-сообщения.
 * 
 * Пример использования:
 * <AllOneTimeModal onCancel={...} onOpen={...} />
 * 
 * @dependencies
 * - OneTimeColumns: Описание колонок для таблицы разовых задач
 * - useOneTime: Кастомный хук для работы с разовыми задачами через GraphQL
 * - useCustomMessage: Контекст для показа ошибок/уведомлений
 */
import React, {useEffect} from "react";
import { 
    Button,
    Flex,
    Modal,
    Table,
    Skeleton
} from "antd";
import OneTimeColumns from "./OnetimeColumns";
import { useOneTime } from "../../../../../../hooks/api/useOneTime";
import { useCustomMessage } from "../../../../../../context/MessageContext";

const AllOneTimeModal = React.memo(({ onCancel, onOpen}) => {
    const {msgError} = useCustomMessage();
    const {actions, loading, fetchOneTimesData} = useOneTime({
        onError: (error) => msgError(`Ошибка при работе с Разовыми задачами: ${error.message || error}`)
    });

    const handleFetchData = async () => {
        await actions.fetchOneTimes({variables: {filter:{}}});
    }

    useEffect(() => {
        if (!onOpen) return;
        const fetchData = async () => {
            await handleFetchData();
        }
        fetchData()
    }, [onOpen]);

    return (
        <Modal
            title='Просмотр всех АКТИВНЫХ разовых задач'
            open={onOpen}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
            width={1500}
        >
            <Flex vertical gap={10}>
                <Flex>
                    <Button>{fetchOneTimesData?.length}</Button>
                </Flex>
                {loading.fetchOneTimes ? (
                    <Skeleton
                        active
                        paragraph={{ rows: 6 }}
                        title={{ width: "40%" }}
                    />
                ) : (
                    <Table
                        pagination={false}
                        dataSource={fetchOneTimesData}
                        columns={OneTimeColumns}
                        size="middle"
                        rowKey="id"
                        loading={false}
                        scroll={{ y: "300px" }}
                    />
                )}
            </Flex>
        </Modal>
    )
})

export default AllOneTimeModal;