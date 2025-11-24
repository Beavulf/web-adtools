import React, {useCallback, useEffect, useMemo} from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { 
    GET_TASK_INFO, 
    STOP_TASK, 
    START_TASK, 
    UPDATE_TASK, 
    FIRE_ONTICK_TASK 
} from "../../query/ServiceQuery";
import { GET_SCHEDULES } from "../../query/GqlQuery";
import { GET_RECALLS } from "../../query/RecallQuery";
import {GET_ONETIME_TASKS} from "../../query/OneTimeQuery"

const taskName = import.meta.env.VITE_APP_TASK_NAME;

export function useCronTask(options={}) {
    const {enabled = true, onError, pollInterval} = options;
    const client = useApolloClient();

    const refetchTaskInfo = [{query: GET_TASK_INFO, variables: {taskName}}];

    const handleError = useCallback((error) => {
        if (onError) {
            onError(error);
        }
    }, [onError]);

    const { data: dataTaskInfo, loading: loadingTaskInfo, error: errorTaskInfo } = useQuery(
        GET_TASK_INFO,
        {
            variables: { taskName },
            fetchPolicy: 'cache-and-network',
            skip: !enabled,           
            ...(pollInterval && { pollInterval })
        }
    );
    useEffect(()=>{
        if (errorTaskInfo) {
            handleError(errorTaskInfo);
        }
    },[errorTaskInfo, handleError])

    const [stopTaskMutation, { loading: loadingStopTask }] = useMutation(STOP_TASK,{
        refetchQueries: refetchTaskInfo,
        onError: handleError
    });
    const [startTaskMutation, { loading: loadingStartTask }] = useMutation(START_TASK,{
        refetchQueries: refetchTaskInfo,
        onError: handleError
    });
    const [updateTaskMutation, { loading: loadingUpdateTask }] = useMutation(UPDATE_TASK,{
        refetchQueries: refetchTaskInfo,
        onError: handleError
    });

    // После «горячего запуска» сервер меняет связанные расписания, которые не входят в ответ мутации.
    // Делаем явный refetch GET_SCHEDULES, чтобы таблицы/виджеты с расписаниями обновились без перезахода в модалку.
    const [fireOnTickMutation, { loading: loadingFireOnTick }] = useMutation(FIRE_ONTICK_TASK,{
        refetchQueries: refetchTaskInfo,
        awaitRefetchQueries: true,
        onError: handleError,
        onCompleted: async () => {
            // Добавляем задержку 700 мс перед ручным обновлением данных расписания в Apollo
            await new Promise(resolve => setTimeout(resolve, 1000));
            await client.refetchQueries({
                include: [
                    { query: GET_SCHEDULES, variables: {filter:{}}},
                    { query: GET_RECALLS, variables: {filter:{}}},
                    { query: GET_ONETIME_TASKS, variables: {filter:{}}},
                ],
                onQueryUpdated: (observableQuery) => {
                    // Принудительно обновляем запрос после задержки
                    return observableQuery.refetch();
                }
            });
        }
    });

    const startTask = useCallback(
        ()=>startTaskMutation({variables: {taskName}}),
        [startTaskMutation, taskName]
    );
    const stopTask = useCallback(
        ()=>stopTaskMutation({variables: {taskName}}),
        [stopTaskMutation, taskName]
    );
    const updateTask = useCallback(
        (cronExpression)=>updateTaskMutation({variables: {taskName, cronExpression}}),
        [updateTaskMutation, taskName]
    );
    const fireOnTick = useCallback(
        ()=>fireOnTickMutation({variables: {taskName}}),
        [fireOnTickMutation, taskName]
    );

    const taskInfo = useMemo(() => dataTaskInfo?.getCronTaskInfo ?? null, [dataTaskInfo]);

    return useMemo(()=>({
        taskInfo,
        loading: {
            info: loadingTaskInfo,
            stop: loadingStopTask,
            start: loadingStartTask,
            update: loadingUpdateTask,
            fireOnTick: loadingFireOnTick
        },
        error: errorTaskInfo,
        actions: {
            startTask,
            stopTask,
            updateTask,
            fireOnTick,
        }
    }),[
        taskInfo,
        loadingTaskInfo,
        loadingStopTask,
        loadingStartTask,
        loadingUpdateTask,
        loadingFireOnTick,
        errorTaskInfo,
        startTask,
        stopTask,
        updateTask,
        fireOnTick,
    ])
}
