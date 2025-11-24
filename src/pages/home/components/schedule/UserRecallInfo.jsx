/**
 * UserRecallInfo компонент отображает информацию об "отзывах" для выбранного пользователя или записи в расписании.
 * Может работать как с обычными отзывами, так и с архивированными, в зависимости от флага isArchive.
 * Использует Ant Design карточки и сообщения. Все данные загружает через кастомный хук useRecall.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.record - Объект с информацией о расписании пользователя.
 * @param {boolean} [props.isArchive=false] - Показывать ли архивированные отзывы.
 *
 * @example
 * <UserRecallInfo record={userSchedule} isArchive={false} />
 */

import React, { useEffect } from "react";
import {
    Flex,
    Typography,
    Button,
    Popconfirm,
    Card,
    Space,
    Tag,
    Divider
} from 'antd';
import dayjs from "dayjs";
import { DeleteOutlined, FileZipOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../context/MessageContext";
import { useRecall } from "../../../../hooks/api/useRecall";

const {Text} = Typography;

const UserRecallInfo = React.memo(({record, isArchive = false}) => {
    const {msgError, msgSuccess} = useCustomMessage()
    const {actions, fetchArchiveRecallsData, fetchRecallsData, loading} = useRecall();

    useEffect(() => {
        if (!record?.id) {
            return;
        }
        let cancelled = false;
        const loadRecalls = async () => {
            try {
                const variables = {
                    filter: { scheduleId: { contains: record.id } }
                };
    
                if (isArchive) {
                    await actions.fetchArchiveRecalls({ variables });
                } else {
                    await actions.fetchRecalls({ variables });
                }

                if (cancelled) {return;}
    
            } catch (err) {
                if (cancelled) {return;}
    
                if (err.message?.includes('aborted') || err.networkError?.statusCode === -1) {
                    return;
                }
    
                msgError(`Ошибка при загрузке записей: ${err.message}`);
            }
        };
    
        loadRecalls();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record?.id, isArchive])

    // удаление отзыва
    const handleDeleteRecall = async (recall) => {
        try {
            await actions.deleteRecall(recall.id);
            msgSuccess('Отзыв успешно удален.');
        }
        catch(err) {
            msgError(`Ошибка при удалении отзыва: ${err.message}`);
        }
    }

    // архивация отзыва и удаление из расписания
    const handleArchiveRecall = async (recall)=> {
        try {
          await actions.archiveRecall(recall.id);
          msgSuccess('Отзыв успешно отправлен в архив и удален из расписания');
        }
        catch(err) {
          msgError(`Ошибка при архивации отзыва: ${err.message}`);
        }
    }

    const recalls = isArchive ? fetchArchiveRecallsData : fetchRecallsData;

    return (
        <Flex vertical gap={12}>
        {recalls.map((recall) => (
            <Card
                key={recall.id}
                size="small"
                style={{
                    borderRadius: 10,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    background: "#fafafa",
                }}
                styles={{body:{ padding: "10px 16px" }}}
            >
            <Flex justify="space-between" align="start">
            {/* Левая часть с основной информацией */}
                <Flex vertical gap={4}>
                    <Text strong>Отзыв — приказ <Text style={{ color: "purple" }}>{recall.order}</Text></Text>

                    <Space size={6} wrap>
                        <Text>с</Text>
                        <Text style={{ fontStyle: "italic", color: "teal" }}>
                            {dayjs(recall.startDate).format("DD.MM.YYYY")}
                        </Text>
                        <Text>по</Text>
                        <Text style={{ fontStyle: "italic", color: "teal" }}>
                            {dayjs(recall.endDate).format("DD.MM.YYYY")}
                        </Text>
                    </Space>

                    <Space size={6}>
                        <Text>статус:</Text>
                        <Tag color={recall.status ? "green" : "orange"}>
                            {recall.status ? "выполняется" : "ожидание"}
                        </Tag>
                    </Space>

                    {recall.description && (
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {recall.description}
                        </Text>
                    )}
                </Flex>

                {/* Правая часть с действиями */}
                {!isArchive && (
                <Flex vertical gap={4}>
                    <Popconfirm
                        title="Архивирование"
                        description="Архивировать отзыв и удалить?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={()=>handleArchiveRecall(recall)}
                    >
                    <Button
                        size="middle"
                        icon={<FileZipOutlined />}
                        loading={loading.archive}
                        type="default"
                        title="Архивировать отзыв и удалить из расписания"
                    />
                    </Popconfirm>

                    <Popconfirm
                        title="Удаление отзыва"
                        description="Удалить отзыв без архивации?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={()=>handleDeleteRecall(recall)}
                    >
                    <Button
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                        loading={loading.delete}
                        title="Удалить запись отзыва"
                    />
                    </Popconfirm>
                </Flex>
                )}
            </Flex>

          <Divider style={{ margin: "8px 0" }} />

          {/* Нижняя строка с метаданными */}
          <Flex justify="space-between" align="center">
            <Text type="secondary" style={{ fontSize: 12 }}>
              создан: {dayjs(recall.createdAt).format("DD.MM.YYYY HH:mm:ss")}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {recall.createdBy}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
    )
})

export default UserRecallInfo;