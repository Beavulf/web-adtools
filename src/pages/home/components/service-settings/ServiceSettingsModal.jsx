import React, {useState, useEffect} from "react";
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
    Popover
} from 'antd'
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { GET_TASK_INFO, STOP_TASK, START_TASK, UPDATE_TASK, FIRE_ONTICK_TASK } from "../../../../query/ServiceQuery";
import { GET_SCHEDULES } from "../../../../query/GqlQuery";
import { BulbOutlined, CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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

const {Text} = Typography;
const taskName = 'handleUserBlockingSchedule'

const ServiceSettingsModal = React.memo(({isOpen, onCancel})=>{
    const [messageApi, contextHolder] = message.useMessage();
    const client = useApolloClient();

    const [stopTask, { loading: loadingStopTask, error: errorStopTask }] = useMutation(STOP_TASK,{
        refetchQueries: [{ query: GET_TASK_INFO, variables: { taskName } }]
    });
    const [startTask, { loading: loadingStartTask, error: errorStartTask }] = useMutation(START_TASK,{
        refetchQueries: [{ query: GET_TASK_INFO, variables: { taskName } }]
    });
    const [updateTask, { loading: loadingUpdateTask, error: errorUpdateTask }] = useMutation(UPDATE_TASK,{
        refetchQueries: [{ query: GET_TASK_INFO, variables: { taskName } }]
    });
    const [fireOnTick, { loading: loadingFireOnTick, error: errorFireOnTick }] = useMutation(FIRE_ONTICK_TASK,{
        refetchQueries: [{ query: GET_SCHEDULES }, { query: GET_TASK_INFO, variables: { taskName } } ],
        awaitRefetchQueries: true,
        onError: (err)=> messageApi.error(err.message),
        onCompleted: async () => {
            // Явно обновляем GET_SCHEDULES после завершения мутации
            try {
                await client.refetchQueries({
                    include: [GET_SCHEDULES],
                    updateCache: false
                });
            } catch (err) {
                messageApi.error('Error refetching schedules:', err);
            }
        }
    });

    const { data: dataTaskInfo, loading: loadingTaskInfo, error: errorTaskInfo } = useQuery(
        GET_TASK_INFO,
        {
            variables: { taskName },
            fetchPolicy: 'cache-and-network',
            skip: !isOpen,
            onError: (err)=> messageApi.error(err.message)
        }
    );

    const handleStopTask = async () => {
        try {
            await stopTask({ variables: { taskName } })
            messageApi.success('Служба остановлена')
        }
        catch(err) {
            messageApi.error(err.message)
        }
    }

    const handleStartTask = async () => {
        try {
            await startTask({ variables: { taskName } })
            messageApi.success('Служба запущена')
        }
        catch(err) {
            messageApi.error(err.message)
        }
    }

    const handleUpdateTask = async () => {
        try {
            if (!source || source.length < 7) {
                messageApi.error('Введите корректное время расписания службы')
                return
            }
            await updateTask({ variables: { taskName, cronExpression: source } })
            messageApi.success('Время расписания службы обновлено')
        }
        catch(err) {
            messageApi.error(err.message)
        }
    }

    const handleFireOnTick = async () => {
        try {
            await fireOnTick({ variables: { taskName } })
            messageApi.success('Служба выполнена прямо сейчас')
        }
        catch(err) {
            messageApi.error(err.message)
        }
    }

    // отображение исходного времени расписания службы
    const [source, setSource] = useState('')
    useEffect(() => {
        if (dataTaskInfo?.getCronTaskInfo?.source) {
            setSource(dataTaskInfo.getCronTaskInfo.source);
        }
    }, [dataTaskInfo?.getCronTaskInfo?.source]);

    // отображение статуса службы
    function ViewServiceStatus() {
        return (
            <Tag color={dataTaskInfo?.getCronTaskInfo?.isActive ? 'green' : 'red'}>
                <Text>{dataTaskInfo?.getCronTaskInfo?.isActive ? 'Включена' : 'Выключена'}</Text>
            </Tag>
        )
    }
    
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
            <Card title={<Text>Служба <span style={{color:'purple'}}>{taskName}</span></Text>} extra={<ViewServiceStatus/>}>
                {loadingTaskInfo && <Text>Загрузка...</Text>}
                {errorTaskInfo && <Text type="danger">Ошибка: {errorTaskInfo.message}</Text>}
                {dataTaskInfo && (
                    <Flex vertical gap={10}>
                        <Flex align="center">
                            <Text>Установленное время сработки службы:</Text>
                            <Input 
                                value={source} 
                                onChange={(e)=>setSource(e.target.value)} 
                                suffix={
                                    <Popconfirm
                                        title="Сохранение"
                                        description={
                                            <Flex vertical>
                                                <Text>Сохранить внесенные изменения в расписание службы?</Text>
                                                <span style={{color:'gray'}}>*сохраненное расписание действует до перезапуска сервера</span>
                                            </Flex>
                                        }
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={handleUpdateTask}
                                        loading={loadingUpdateTask}
                                    >
                                        <StyledCheckIcon 
                                            title="Сохранить измнения" 
                                        />
                                    </Popconfirm>
                                }
                                addonAfter={<ReloadOutlined title="Сбросить" size='small' onClick={()=>setSource(dataTaskInfo?.getCronTaskInfo?.source)}/>}
                            >
                            </Input>
                        </Flex>
                        <Flex gap={5} vertical style={{backgroundColor:'rgba(187, 187, 187, 0.1)', borderRadius:'8px', padding:'5px', color:'gray'}}>
                            <Flex align="center" justify="center" gap={10} >
                                <Flex>
                                    {/* <BulbOutlined  style={{marginRight:'5px'}}/> */}
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
                            <Flex>
                                
                            </Flex>
                        </Flex>
                        <Flex justify="space-between" style={{margin:'0'}}>
                            <Text>Дата след. сработки: {dataTaskInfo?.getCronTaskInfo?.sendAt}</Text>
                            <Text>Время до след сработки: {dataTaskInfo?.getCronTaskInfo?.getTimeout}</Text>
                        </Flex>
                        <Flex justify="space-between" style={{margin:'0'}}>
                            <Text>Следующий запуск: {dayjs(dataTaskInfo?.getCronTaskInfo?.nextDate).format('DD.MM.YYYY HH:mm:ss')}</Text>
                            <Text>Последний запуск: {dataTaskInfo?.getCronTaskInfo?.lastDate ?? '-'}</Text>
                        </Flex>
                        <Flex gap={10} style={{marginTop:'10px'}}>
                            <Button 
                                block 
                                color='green' 
                                variant="filled" 
                                disabled={dataTaskInfo?.getCronTaskInfo?.isActive}
                                onClick={async () => await handleStartTask()}
                                loading={loadingStartTask}
                                title="Запустить службу на сервере"
                                >Запустить
                            </Button>
                            <Popconfirm
                                title="Выполнение"
                                description="Выполнить службу прямо сейчас?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={async () => await handleFireOnTick()}
                                loading={loadingFireOnTick}
                            >
                                <Button 
                                    block 
                                    color="orange" 
                                    variant="filled" 
                                    title="Прямо сейчас выполнить задачи"
                                    >Горячий запуск
                                </Button>
                            </Popconfirm>
                            <Button 
                                block 
                                color="danger" 
                                variant="filled"
                                onClick={async ()=> await handleStopTask()}
                                loading={loadingStopTask}
                                title="Остановить службу на сервере"
                                >Остановить
                            </Button>
                        </Flex>
                    </Flex>
                )}
                {/* {dataTaskInfo && (
                    <pre>{JSON.stringify(dataTaskInfo, null, 2)}</pre>
                )} */}
                
            </Card>
        </Modal>
    )
})
// 1-й (0): минута (0-я минута часа)
// 2-й (0-23/5): часы (каждые 5 часов с 0 до 23)
// 3-й (): день месяца (каждый день)
// 4-й (): месяц (каждый месяц)
// 5-й (): день недели (любые дни недели)
export default ServiceSettingsModal;