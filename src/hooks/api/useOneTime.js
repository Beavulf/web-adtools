import { useCallback, useMemo, useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
    CREATE_ONETIME_TASK,
    GET_ONETIME_TASKS,
    DELETE_ONETIME_TASK,
    ARCHIVE_ONETINE_TASK,
    GET_ARCHIVE_ONETIME_TASKS,
} from "../../query/OneTimeQuery.js";

/**
 * Хук для работы с одноразовыми задачами отпуска/командировок.
 * Возвращает данные, состояния загрузки и действия для CRUD-операций.
 */
export function useOneTime(options = {}) {
    const {
        enabled = false,
        onError,
        pollInterval,
        filter = {}
    } = options;

    const [lastError, setLastError] = useState(null);

    // Универсальный обработчик ошибок, который сохраняет последнюю ошибку и пробрасывает её наружу.
    const handleError = useCallback((error) => {
        setLastError(error);
        if (onError) {
            onError(error);
        }
    }, [onError]);

    // Список запросов, которые нужно перезапрашивать после мутаций.
    const refetchOneTimeTasks = [
        { query: GET_ONETIME_TASKS, variables: { filter } }
    ];

    const {
        data: dataOneTimes,
        loading: loadingOneTimes,
        refetch: refetchOneTimes,
        error: errorOneTimes
    } = useQuery(GET_ONETIME_TASKS, {
        variables: { filter },
        fetchPolicy: "cache-and-network",
        skip: !enabled,
        ...(pollInterval && { pollInterval })
    });

    // Подписка на ошибки основного запроса.
    useEffect(() => {
        if (errorOneTimes) {
            handleError(errorOneTimes);
        }
    }, [errorOneTimes, handleError]);

    const [fetchOneTimes,{ data: dataFetchOneTimes, loading: loadingFetchOneTimes }] = useLazyQuery(GET_ONETIME_TASKS, {
        fetchPolicy: "network-only",
        onError: handleError
    });

    const [createOneTime, { loading: loadingCreateOneTime }] = useMutation(
        CREATE_ONETIME_TASK,
        {
            refetchQueries: [...refetchOneTimeTasks],
            onError: handleError
        }
    );

    const [deleteOneTime, { loading: loadingDeleteOneTime }] = useMutation(
        DELETE_ONETIME_TASK,
        {
            refetchQueries: [...refetchOneTimeTasks],
            onError: handleError
        }
    );

    const [archiveOneTime, { loading: loadingArchiveOneTime }] = useMutation(
        ARCHIVE_ONETINE_TASK,
        {
            refetchQueries: [...refetchOneTimeTasks],
            onError: handleError
        }
    );

    const [fetchArchiveOneTimes, { data: dataFetchArchiveOneTimes, loading: loadingFetchArchiveOneTimes }] = useLazyQuery(
        GET_ARCHIVE_ONETIME_TASKS,
        {
            fetchPolicy: "network-only",
            onError: handleError
        }
    );   

    // Обёртки для действий, чтобы очищать последнюю ошибку перед выполнением.
    const handleCreateOneTime = useCallback(async (variables) => {
        setLastError(null);
        return createOneTime({ variables });
    }, [createOneTime]);

    const handleDeleteOneTime = useCallback(async (id) => {
        setLastError(null);
        return deleteOneTime({ variables: { id } });
    }, [deleteOneTime]);

    const handleArchiveOneTime = useCallback(async (id) => {
        setLastError(null);
        return archiveOneTime({ variables: { id } });
    }, [archiveOneTime]);

    // Мемоизация данных, чтобы не пересчитывать их без необходимости.
    const oneTimes = useMemo(() => dataOneTimes?.getOneTimes ?? [], [dataOneTimes]);
    const fetchOneTimesData = useMemo(
        () => dataFetchOneTimes?.getOneTimes ?? [],
        [dataFetchOneTimes]
    );
    // Мемоизированный массив архивных задач
    const fetchArchiveOneTimesData = useMemo(
        () => dataFetchArchiveOneTimes?.getArchiveOneTimes ?? [],
        [dataFetchArchiveOneTimes]
    );
    return useMemo(() => ({
        oneTimes,
        fetchOneTimesData,
        fetchArchiveOneTimesData,
        lastError,
        loading: {
            oneTimes: loadingOneTimes,
            fetchOneTimes: loadingFetchOneTimes,
            fetchArchiveOneTimes: loadingFetchArchiveOneTimes,
            create: loadingCreateOneTime,
            delete: loadingDeleteOneTime,
            archive: loadingArchiveOneTime
        },
        actions: {
            fetchOneTimes,
            fetchArchiveOneTimes,
            refetchOneTimes,
            createOneTime: handleCreateOneTime,
            deleteOneTime: handleDeleteOneTime,
            archiveOneTime: handleArchiveOneTime
        }
    }), [
        oneTimes,
        fetchOneTimesData,
        fetchArchiveOneTimesData,
        lastError,
        loadingOneTimes,
        loadingFetchOneTimes,
        loadingCreateOneTime,
        loadingDeleteOneTime,
        loadingArchiveOneTime,
        loadingFetchArchiveOneTimes,
        fetchOneTimes,
        fetchArchiveOneTimes,
        refetchOneTimes,
        handleCreateOneTime,
        handleDeleteOneTime,
        handleArchiveOneTime
    ]);
}
