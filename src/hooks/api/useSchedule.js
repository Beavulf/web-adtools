import { useCallback, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import {
    GET_SCHEDULES,
    GET_ARCHIVE_SCHEDULES,
    DELETE_SCHEDULE,
    CREATE_SCHEDULE,
    ARCHIVE_SCHEDULE,
    GET_FIO_SCHEDULES,
    GET_FIO_ARCHIVE_SCHEDULES
} from "../../query/GqlQuery.js";

export function useSchedule(options={}) {
    const {
        enabled=false, 
        enabledArchive=false,
        onError, 
        pollInterval, 
        pollIntervalArchive,
        filter={},
        filterArchive={}
    } = options;

    const [lastError, setLastError] = useState(null)
    const handleError = useCallback((error) => {
        setLastError(error);
        if (onError) {
            onError(error);
        }
    }, [onError]);

    const refetchSchedules = [
        { query: GET_SCHEDULES, variables: { filter:{} } },
    ];

    const { data: dataSchedules, loading: loadingSchedules, refetch: refetchDataSchedules, error: errorSchedules } = useQuery(
        GET_SCHEDULES,
        {
            variables: {filter},
            fetchPolicy: 'cache-and-network',
            skip: !enabled,
            // Если передан pollInterval, запрос будет автоматически повторяться 
            ...(pollInterval && { pollInterval }),
        }
    );
    // для отлова ошибки запроса
    useEffect(()=>{
        if (errorSchedules) {
            handleError(errorSchedules);
        }
    },[errorSchedules, handleError])

    const [fetchSchedules, { data: dataFetchSchedules, loading: loadingFetchSchedules }] = useLazyQuery(
        GET_SCHEDULES,
        {
            fetchPolicy: 'network-only',
            onError: handleError
        }
    );
    const [createSchedule, { loading: loadingCreateSchedule }] = useMutation(
        CREATE_SCHEDULE,{
        refetchQueries: [
            ...refetchSchedules,
        ],
        onError: handleError
    });
    const [deleteSchedule, { loading: loadingDeleteSchedule }] = useMutation(
        DELETE_SCHEDULE,{
        refetchQueries: [
            ...refetchSchedules,
        ],
        onError: handleError
    });
    const [fetchFioSchedule, { data: dataFetchFioSchedule, loading: loadingFetchFioSchedule }] = useLazyQuery(
        GET_FIO_SCHEDULES,
        {
            fetchPolicy: 'network-only',
            onError: handleError,
        }
    );
    
    const { data: dataArchiveSchedules, loading: loadingArchiveSchedules, refetch: refetchDataArchiveSchedules, error: errorArchiveSchedules } = useQuery(
        GET_ARCHIVE_SCHEDULES,
        {
            variables: {filter: filterArchive},
            fetchPolicy: 'cache-and-network',
            skip: !enabledArchive,
            ...(pollIntervalArchive && { pollInterval: pollIntervalArchive }),
        }
    );
    // для отлова ошибки запроса
    useEffect(() => {
        if (errorArchiveSchedules) {
            handleError(errorArchiveSchedules);
        }
    }, [errorArchiveSchedules, handleError]);

    const [fetchArchiveSchedules, { data: dataFetchArchiveSchedules, loading: loadingFetchArchiveSchedules }] = useLazyQuery(
        GET_ARCHIVE_SCHEDULES,
        {
            fetchPolicy: 'network-only',
            onError: handleError
        }
    );
    const [fetchFioArchiveSchedule, { data: dataFetchFioArchiveSchedule, loading: loadingFetchFioArchiveSchedule }] = useLazyQuery(
        GET_FIO_ARCHIVE_SCHEDULES,
        {
            fetchPolicy: 'network-only',
            onError: handleError,
        }
    );
    const [archiveSchedule, { loading: loadingArchiveSchedule }] = useMutation(
        ARCHIVE_SCHEDULE,{
        refetchQueries: [
            ...refetchSchedules,
            { query: GET_ARCHIVE_SCHEDULES, variables: { filter: filterArchive } }
        ],
        onError: handleError
    });
    

    const handleCreateSchedule = useCallback(
        async (variables) => {
            setLastError(null);
            const result = await createSchedule({ variables });
            return result;
        },
        [createSchedule]
    );

    const handleDeleteSchedule = useCallback(
        async (id) => {
            setLastError(null);
            const result = await deleteSchedule({ variables: {id} });
            return result;
        },
        [deleteSchedule]
    );

    const handleArchiveSchedule = useCallback(
        async (values) => {
            setLastError(null);
            const result = await archiveSchedule({ variables: values });
            return result;
        },
        [archiveSchedule]
    );

    // Оборачиваем значения в useMemo, чтобы они пересчитывались только при изменении исходных data
    const schedules = useMemo(
        () => dataSchedules?.getSchedules ?? [],
        [dataSchedules]
    );
    const archiveSchedules = useMemo(
        () => dataArchiveSchedules?.getArchiveSchedules ?? [],
        [dataArchiveSchedules]
    );
    const fetchSchedulesData = useMemo(
        () => dataFetchSchedules?.getSchedules ?? [],
        [dataFetchSchedules]
    );
    const fetchArchiveSchedulesData = useMemo(
        () => dataFetchArchiveSchedules?.getArchiveSchedules ?? [],
        [dataFetchArchiveSchedules]
    );
    const fetchFioScheduleData = useMemo(
        () => dataFetchFioSchedule?.getSchedules ?? [],
        [dataFetchFioSchedule]
    );
    const fetchFioArchiveScheduleData = useMemo(
        () => dataFetchFioArchiveSchedule?.getArchiveSchedules ?? [],
        [dataFetchFioArchiveSchedule]
    );

    return useMemo(()=>({
        // Данные
        schedules,
        archiveSchedules,
        fetchSchedulesData,
        fetchArchiveSchedulesData,
        fetchFioScheduleData,
        fetchFioArchiveScheduleData,
        lastError,
        // Состояния загрузки
        loading: {
            schedules: loadingSchedules,
            fetchSchedules: loadingFetchSchedules,
            create: loadingCreateSchedule,
            delete: loadingDeleteSchedule,
            archive: loadingArchiveSchedule,
            archiveSchedules: loadingArchiveSchedules,
            fetchArchiveSchedules: loadingFetchArchiveSchedules,
            fetchFioSchedule: loadingFetchFioSchedule,
            fetchFioArchiveSchedule: loadingFetchFioArchiveSchedule
        },
        // Действия
        actions: {
            fetchSchedules: fetchSchedules,
            fetchArchiveSchedules: fetchArchiveSchedules,
            fetchFioSchedule: fetchFioSchedule,
            fetchFioArchiveSchedule: fetchFioArchiveSchedule,
            refetchDataSchedules,
            refetchDataArchiveSchedules,
            createSchedule: handleCreateSchedule,
            deleteSchedule: handleDeleteSchedule,
            archiveSchedule: handleArchiveSchedule
        }
    }),[
        // Передаем все зависимости, которые используются внутри useMemo
        schedules,
        archiveSchedules,
        fetchSchedulesData,
        fetchArchiveSchedulesData,
        fetchFioScheduleData,
        fetchFioArchiveScheduleData,
        lastError,
        loadingSchedules,
        loadingFetchSchedules,
        loadingCreateSchedule,
        loadingDeleteSchedule,
        loadingArchiveSchedule,
        loadingArchiveSchedules,
        loadingFetchArchiveSchedules,
        loadingFetchFioSchedule,
        loadingFetchFioArchiveSchedule,
        fetchSchedules,
        fetchArchiveSchedules,
        fetchFioSchedule,
        fetchFioArchiveSchedule,
        refetchDataSchedules,
        refetchDataArchiveSchedules,
        handleCreateSchedule,
        handleDeleteSchedule,
        handleArchiveSchedule
    ]);
}

