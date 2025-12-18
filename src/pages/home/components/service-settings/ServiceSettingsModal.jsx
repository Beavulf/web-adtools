/**
 * Модальное окно для отображения и управления состоянием службы Active Directory.
 * Позволяет запускать и останавливать задачу с помощью кнопок и показывает актуальный статус.
 * Использует Ant Design и styled-components для оформления.
 *
 * @component
 * @param {Object} props
 * @param {boolean} isOpen - Флаг открытия модального окна.
 * @param {Function} onCancel - Колбэк на закрытие модального окна.
 */

import React, { useState, useEffect } from "react";
import {
    Modal,
    Typography,
    Card,
    Tag,
    Flex,
    Input,
    Button,
    Popconfirm,
    message,
} from 'antd'
import { CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCronTask } from "../../../../hooks/api/useCronTask";
import { useSchedule } from "../../../../hooks/api/useSchedule"
import { useRecall } from "../../../../hooks/api/useRecall";
import timeLeft from "../../../../utils/formatTimeLeft";
import styled from "styled-components";
import dayjs from "dayjs";

const StyledCheckIcon = styled(CheckCircleOutlined)`
    color: green;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: rgba(0, 128, 0, 0.1);
    }
`;

const { Text } = Typography;
const taskName = import.meta.env.VITE_APP_TASK_NAME;

const ServiceSettingsModal = React.memo(({ isOpen, onCancel }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { actions: actionsSchedule } = useSchedule({
        onError: (err) => messageApi.error(`Ошибка при работе с расписанием: ${err.message}`)
    });
    const { actions: actionsRecall } = useRecall({
        onError: (err) => messageApi.error(`Ошибка при работе с отзывом: ${err.message}`)
    });
    const { taskInfo, loading, actions, error: errorTaskInfo } = useCronTask({
        enabled: isOpen, onError: (err) => messageApi.error(`Ошибка при работе со службой: ${err.message}`)
    });
    const time = timeLeft(taskInfo?.getTimeout);

    const handleStopTask = async () => {
        try {
            await actions.stopTask();
            messageApi.success('Служба остановлена');
        }
        catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleStartTask = async () => {
        try {
            await actions.startTask();
            messageApi.success('Служба запущена');
        }
        catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleUpdateTask = async () => {
        try {
            if (!source || source.length < 7) {
                messageApi.error('Введите корректное время расписания службы');
                return;
            }
            await actions.updateTask(source);
            messageApi.success('Время расписания службы обновлено');
        }
        catch (err) {
            messageApi.error(err.message);
        }
    };

    const handleFireOnTick = async () => {
        try {
            await actions.fireOnTick();
            await actionsSchedule.fetchSchedules({ variables: { filter: {} } });
            await actionsRecall.fetchRecalls({ variables: { filter: {} } });
            messageApi.success('Служба выполнена прямо сейчас.');
        }
        catch (err) {
            messageApi.error(err.message);
        }
    };

    // отображение исходного времени расписания службы
    const [source, setSource] = useState('')
    useEffect(() => {
        if (isOpen && taskInfo?.source) {
            setSource(taskInfo?.source);
        }
    }, [taskInfo?.source, isOpen]);

    // отображение статуса службы
    function ServiceStatusTag() {
        return (
            <Tag color={taskInfo?.isActive ? 'green' : 'red'}>
                <Text>{taskInfo?.isActive ? 'Включена' : 'Выключена'}</Text>
            </Tag>
        )
    };

    return (
        <Modal
            title={<Text>Настройки службы расписания</Text>}
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            width={700}
            destroyOnHidden
        >
            {contextHolder}
            <Card title={<Text>Служба <span style={{ color: 'purple' }}>{taskName}</span></Text>} extra={<ServiceStatusTag />}>
                {loading.info && <Text>Загрузка...</Text>}
                {errorTaskInfo && <Text type="danger">Ошибка: {errorTaskInfo?.message}</Text>}
                {taskInfo && (
                    <Flex vertical gap={10}>
                        <Flex align="center">
                            <Text>Установленное время сработки службы:</Text>
                            <Input
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                suffix={
                                    <Popconfirm
                                        title="Сохранение"
                                        description={
                                            <Flex vertical>
                                                <Text>Сохранить внесенные изменения в расписание службы?</Text>
                                                <span style={{ color: 'gray' }}>*сохраненное расписание действует до перезапуска сервера</span>
                                            </Flex>
                                        }
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={handleUpdateTask}
                                        loading={loading.update}
                                    >
                                        <Button 
                                            title="Сохранить измнения" 
                                            size="small" 
                                            type="primary" 
                                            style={{ backgroundColor: 'rgba(57, 169, 63, 0.73)', borderColor: 'green', alignItems:'center' }}
                                            loading={loading.update}
                                            disabled={loading.update}
                                            >сохранить
                                        </Button>
                                        {/* <StyledCheckIcon
                                            title="Сохранить измнения"
                                            disabled={loading.update}
                                        /> */}
                                    </Popconfirm>
                                }
                                addonAfter={<ReloadOutlined title="Сбросить" size='small' onClick={() => setSource(taskInfo?.source)} />}
                            >
                            </Input>
                        </Flex>
                        <Flex gap={5} vertical style={{ backgroundColor: 'rgba(187, 187, 187, 0.1)', borderRadius: '8px', padding: '5px', color: 'gray' }}>
                            <Flex align="center" justify="center" gap={10} >
                                <Flex>
                                    Подсказка по заполнению:<br></br>
                                    1-й (0): минута (0-я минута часа)<br></br>
                                    2-й (0-23/10): часы (каждые 10 часов с 0 до 23)<br></br>
                                </Flex>
                                <Flex>
                                    3-й (): день месяца (каждый день)<br></br>
                                    4-й (): месяц (каждый месяц)<br></br>
                                    5-й (): день недели (любые дни недели)<br></br>
                                </Flex>
                            </Flex>
                            <Flex style={{ marginLeft: '13px' }}>
                                *по умолчанию стоит - каждые 10 часов в промежутке с 0 до 23 часов*<br></br>
                            </Flex>
                        </Flex>
                        <Flex justify="space-between" style={{ margin: '0' }}>
                            <Text>Дата след. сработки: {taskInfo?.sendAt}</Text>
                            <Text>Время до след сработки: {time}</Text>
                        </Flex>
                        <Flex justify="space-between" style={{ margin: '0' }}>
                            <Text>Следующий запуск: {dayjs(taskInfo?.nextDate).format('DD.MM.YYYY HH:mm:ss')}</Text>
                            <Text>Последний запуск: {taskInfo?.lastDate ? dayjs(taskInfo?.lastDate).format('DD.MM.YYYY HH:mm:ss') : 'нет'}</Text>
                        </Flex>
                        <Flex gap={10} style={{ marginTop: '10px' }}>
                            <Button
                                block
                                color='green'
                                variant="filled"
                                disabled={taskInfo?.isActive}
                                onClick={async () => await handleStartTask()}
                                loading={loading.start}
                                title="Запустить службу на сервере"
                            >Запустить
                            </Button>
                            <Popconfirm
                                title="Выполнение"
                                description="Выполнить службу прямо сейчас?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={handleFireOnTick}
                                loading={loading.fireOnTick}
                            >
                                <Button
                                    block
                                    color="orange"
                                    variant="filled"
                                    title="Прямо сейчас выполнить задачи"
                                    loading={loading.fireOnTick}
                                    disabled={!taskInfo?.isActive || loading.fireOnTick}
                                >Горячий запуск
                                </Button>
                            </Popconfirm>
                            <Button
                                block
                                color="danger"
                                variant="filled"
                                onClick={async () => await handleStopTask()}
                                loading={loading.stop}
                                disabled={!taskInfo?.isActive}
                                title="Остановить службу на сервере"
                            >Остановить
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Card>
        </Modal>
    );
});

export default ServiceSettingsModal;