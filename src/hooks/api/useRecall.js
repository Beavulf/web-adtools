import { useCallback, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import {
  GET_RECALLS,
  CREATE_RECALL,
  DELETE_RECALL,
  ARCHIVE_RECALL,
  GET_ARCHIVE_RECALLS,
} from "../../query/RecallQuery.js";
import { GET_SCHEDULES } from "../../query/GqlQuery.js";

export function useRecall(options = {}) {
  const {
    enabled = false,
    enabledArchive = false,
    onError,
    pollInterval,
    pollIntervalArchive,
    filter = {},
    filterArchive = {},
  } = options;

  const refetchSchedules = [
    { query: GET_SCHEDULES, variables: { filter } },
    { query: GET_RECALLS, variables: { filter: filterArchive } },
  ];

  const [lastError, setLastError] = useState(null);

  const handleError = useCallback(
    (error) => {
      setLastError(error);
      if (onError) {
        onError(error);
      }
    },
    [onError],
  );

  const {
    data: dataRecalls,
    loading: loadingRecalls,
    error: errorRecalls,
  } = useQuery(GET_RECALLS, {
    variables: { filter: {} },
    fetchPolicy: "network-only",
    skip: !enabled,
    // Если передан pollInterval, запрос будет автоматически повторяться
    ...(pollInterval && { pollInterval }),
  });
  useEffect(() => {
    if (errorRecalls) {
      handleError(errorRecalls);
    }
  }, [errorRecalls, handleError]);
  // useLazyQuery НЕ выполняется автоматически - только при вызове функции fetchRecalls()
  const [
    fetchRecalls,
    { data: dataFetchRecalls, loading: loadingFetchRecalls },
  ] = useLazyQuery(GET_RECALLS, {
    fetchPolicy: "network-only",
    onError: handleError,
  });

  const [createRecall, { loading: loadingCreateRecall }] = useMutation(
    CREATE_RECALL,
    {
      refetchQueries: [...refetchSchedules],
      onError: handleError,
    },
  );
  const [deleteRecall, { loading: loadingDeleteRecall }] = useMutation(
    DELETE_RECALL,
    {
      refetchQueries: [...refetchSchedules],
      onError: handleError,
    },
  );

  // useLazyQuery для архива - выполнится только при вызове fetchArchiveRecalls()
  const [
    fetchArchiveRecalls,
    { data: dataFetchArchiveRecalls, loading: loadingFetchArchiveRecalls },
  ] = useLazyQuery(GET_ARCHIVE_RECALLS, {
    fetchPolicy: "network-only",
    onError: handleError,
  });

  // useQuery для архива - выполнится СРАЗУ, если enabled=true
  const {
    data: dataArchiveRecalls,
    loading: loadingArchiveRecalls,
    error: errorArchiveRecalls,
  } = useQuery(GET_ARCHIVE_RECALLS, {
    variables: { filter: filterArchive },
    fetchPolicy: "cache-and-network",
    skip: !enabledArchive,
    ...(pollIntervalArchive && { pollInterval: pollIntervalArchive }),
  });
  useEffect(() => {
    if (errorArchiveRecalls) {
      handleError(errorArchiveRecalls);
    }
  }, [errorArchiveRecalls, handleError]);
  const [archiveRecall, { loading: loadingArchiveRecall }] = useMutation(
    ARCHIVE_RECALL,
    {
      refetchQueries: [
        ...refetchSchedules,
        { query: GET_ARCHIVE_RECALLS, variables: { filter: filterArchive } },
      ],
      onError: handleError,
    },
  );

  // Обёртки для мутаций с автоматическим обновлением данных
  const handleCreateRecall = useCallback(
    async (variables) => {
      const result = await createRecall({ variables });
      return result;
    },
    [createRecall],
  );

  const handleDeleteRecall = useCallback(
    async (id) => {
      const result = await deleteRecall({ variables: { id } });
      return result;
    },
    [deleteRecall],
  );

  const handleArchiveRecall = useCallback(
    async (id) => {
      const result = await archiveRecall({ variables: { id } });
      return result;
    },
    [archiveRecall],
  );

  const recalls = useMemo(() => dataRecalls?.getRecalls ?? [], [dataRecalls]);
  const archiveRecalls = useMemo(
    () => dataArchiveRecalls?.getArchiveRecalls ?? [],
    [dataArchiveRecalls],
  );
  const fetchRecallsData = useMemo(
    () => dataFetchRecalls?.getRecalls ?? [],
    [dataFetchRecalls],
  );
  const fetchArchiveRecallsData = useMemo(
    () => dataFetchArchiveRecalls?.getArchiveRecalls ?? [],
    [dataFetchArchiveRecalls],
  );

  return useMemo(
    () => ({
      // Данные
      lastError,
      recalls,
      archiveRecalls,
      fetchRecallsData,
      fetchArchiveRecallsData,
      // Состояния загрузки
      loading: {
        recalls: loadingRecalls,
        fetchRecalls: loadingFetchRecalls,
        create: loadingCreateRecall,
        delete: loadingDeleteRecall,
        archive: loadingArchiveRecall,
        archiveRecalls: loadingArchiveRecalls,
        fetchArchiveRecalls: loadingFetchArchiveRecalls,
      },
      // Действия
      actions: {
        fetchRecalls,
        fetchArchiveRecalls,
        createRecall: handleCreateRecall,
        deleteRecall: handleDeleteRecall,
        archiveRecall: handleArchiveRecall,
      },
    }),
    [
      // Указываем все зависимости, которые используются внутри useCallback,
      // чтобы useCallback возвращал актуальные значения при изменении данных или функций.
      lastError,
      recalls,
      archiveRecalls,
      fetchRecallsData,
      fetchArchiveRecallsData,
      loadingRecalls,
      loadingFetchRecalls,
      loadingCreateRecall,
      loadingDeleteRecall,
      loadingArchiveRecall,
      loadingArchiveRecalls,
      loadingFetchArchiveRecalls,
      fetchRecalls,
      fetchArchiveRecalls,
      handleCreateRecall,
      handleDeleteRecall,
      handleArchiveRecall,
    ],
  );
}
