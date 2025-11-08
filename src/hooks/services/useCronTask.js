import React, {useCallback} from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { 
    GET_TASK_INFO, 
    STOP_TASK, 
    START_TASK, 
    UPDATE_TASK, 
    FIRE_ONTICK_TASK 
} from "../../query/ServiceQuery";
import { GET_SCHEDULES } from "../../query/GqlQuery";

export function useCronTask(taskName, options={}) {
    const {enabled = true, onError} = options;
    const client = useApolloClient();

    const { data: dataTaskInfo, loading: loadingTaskInfo, error: errorTaskInfo } = useQuery(
        GET_TASK_INFO,
        {
            variables: { taskName },
            fetchPolicy: 'cache-and-network',
            skip: !enabled,
            onError
        }
    );

    const refetchTaskInfo = [{query: GET_TASK_INFO, variables: {taskName}}];

    const [stopTaskMutation, { loading: loadingStopTask }] = useMutation(STOP_TASK,{
        refetchQueries: refetchTaskInfo
    });
    const [startTaskMutation, { loading: loadingStartTask }] = useMutation(START_TASK,{
        refetchQueries: refetchTaskInfo
    });
    const [updateTaskMutation, { loading: loadingUpdateTask }] = useMutation(UPDATE_TASK,{
        refetchQueries: refetchTaskInfo
    });

    // После «горячего запуска» сервер меняет связанные расписания, которые не входят в ответ мутации.
    // Делаем явный refetch GET_SCHEDULES, чтобы таблицы/виджеты с расписаниями обновились без перезахода в модалку.
    const [fireOnTickMutation, { loading: loadingFireOnTick }] = useMutation(FIRE_ONTICK_TASK,{
        refetchQueries: refetchTaskInfo,
        awaitRefetchQueries: true,
        onError,
        onCompleted: async () => {
            // Явно обновляем GET_SCHEDULES после завершения мутации
            await client.refetchQueries({
                include: [{ query: GET_SCHEDULES, variables: {filter:{}}}]
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

    const taskInfo = dataTaskInfo?.getCronTaskInfo ?? null

    return {
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
            refetchTaskInfo
        }
    }
}
