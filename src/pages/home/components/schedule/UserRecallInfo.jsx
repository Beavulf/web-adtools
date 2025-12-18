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
    Divider,
    Tooltip
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
            title={
                <Text strong>
                    Отзыв — приказ <Tag color="purple">{recall.order}</Tag>
                </Text>
            }
            extra={!isArchive && (
                <Space>
                    <Popconfirm
                        title="Архивирование"
                        description="Архивировать этот отзыв?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => handleArchiveRecall(recall)}
                    >
                        <Tooltip title="Архивировать отзыв">
                            <Button
                                size="small"
                                icon={<FileZipOutlined />}
                                loading={loading.archive}
                            />
                        </Tooltip>
                    </Popconfirm>
                    <Popconfirm
                        title="Удаление отзыва"
                        description="Удалить отзыв безвозвратно?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => handleDeleteRecall(recall)}
                    >
                        <Tooltip title="Удалить отзыв">
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                loading={loading.delete}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )}
            style={{ background: "#fafafa" }}
        >
            <Flex vertical gap={8}>
                <Space wrap>
                    <Tag color={recall.status ? "green" : "orange"}>
                        {recall.status ? "выполняется" : "ожидание"}
                    </Tag>
                    <Text style={{ fontStyle: "italic", color: "teal" }}>
                        {dayjs(recall.startDate).format("DD.MM.YYYY")}
                    </Text>
                    <Text>по</Text>
                    <Text style={{ fontStyle: "italic", color: "teal" }}>
                        {dayjs(recall.endDate).format("DD.MM.YYYY")}
                    </Text>
                </Space>

                {recall.description && (
                    <Text type="secondary" style={{ fontSize: 13, paddingLeft: 4 }}>
                        {recall.description}
                    </Text>
                )}

                <Divider style={{ margin: "4px 0" }} />

                <Flex justify="space-between" align="center">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Создал: {recall.createdBy}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(recall.createdAt).format("DD.MM.YYYY HH:mm")}
                    </Text>
                </Flex>
            </Flex>
        </Card>
      ))}
    </Flex>
    )
})

export default UserRecallInfo;