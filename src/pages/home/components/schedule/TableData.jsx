/**
 * TableData компонент для отображения и фильтрации списка задач по расписанию.
 * Использует Ant Design таблицу, поддерживает поиск, отображение детальной информации о пользователе,
 * и кнопки управления (обновить, раскрыть, свернуть).
 * Запрос данных выполняется через useSchedule хук, фильтрация — через filterSchedules.
 *
 * @module TableData
 *
 * @example
 * <TableData onHidden={handleUserInfoHidden} searchValue={inputValue} />
 *
 * Импортируемые хуки и компоненты:
 * - React хуки для управления состоянием и асинхронностью.
 * - Ant Design элементы для UI.
 * - Кастомные хуки useSchedule (для GraphQL-запросов) и useCustomMessage (отображение ошибок).
 * - Внутренние утилиты для фильтрации.
 */
import React, {
  useEffect,
  useState,
  useCallback,
  useDeferredValue,
  Suspense,
  useTransition,
} from "react";
import { 
  Flex, 
  Input, 
  Table, 
  Button, 
  Popover
} from "antd";
import {
  SyncOutlined,
  ExpandOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import scheduleColumns from "./ScheduleColumns";
import UserRecallInfo from "./UserRecallInfo";
import filterSchedules from "../../../../utils/filterSchedules";
import { useSchedule } from "../../../../hooks/api/useSchedule";
import { useCustomMessage } from "../../../../context/MessageContext";

const { Search } = Input;

const TableData = React.memo(({ onHidden, searchValue }) => {
  const { msgError } = useCustomMessage();
  const [confirmTextValue, setConfirmTextValue] = useState("");
  const [hiddenUserInfo, setHiddenUserInfo] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [pending, startTransition] = useTransition();

  const handleViewError = useCallback((error) => {
    msgError(`Ошибка получения данных Задач: ${error.message}`);
  }, []);

  const { actions, loading, schedules } = useSchedule({
    enabled: true,
    pollInterval: 120000,
    onError: handleViewError,
  });

  const deferredConfirmValue = useDeferredValue(confirmTextValue);

  useEffect(() => {
    if (searchValue) setConfirmTextValue(searchValue);
    else setConfirmTextValue("");
  }, [searchValue]);

  // скрытие блока с информацией о пользователе, через передачу родительскому компоненту
  const handleHiddenUserInfo = useCallback(() => {
    setHiddenUserInfo((prev) => {
      const newValue = !prev;
      onHidden?.(newValue);
      return newValue;
    });
  }, [onHidden]);

  const handleSearch = useCallback((value) => {
    setConfirmTextValue(value);
  }, []);

  // фильтруем данные
  useEffect(() => {
    if (!schedules) return;

    startTransition(() => {
      if (!deferredConfirmValue.trim()) {
        setFilteredSchedules(schedules);
      } else {
        const filteredSchedules = filterSchedules(
          schedules,
          deferredConfirmValue,
        );
        setFilteredSchedules(filteredSchedules);
      }
    });
  }, [schedules, deferredConfirmValue]);

  const columns = scheduleColumns(false);

  return (
    <Flex
      vertical
      gap={5}
      style={{ minHeight: 0, transition: "all 0.3s ease-out", height: "100%" }}
    >
      <Flex gap={5}>
        <Popover content={<span>Строк в таблице</span>}>
          <Button type="" style={{ color: "gray" }}>
            {filteredSchedules.length}
          </Button>
        </Popover>

        <Search
          placeholder="Поиск (Enter) по ФИО, логину, датам (гггг-мм-дд), приказу, описанию..."
          onSearch={handleSearch}
          allowClear
        />
        <Popover
          content={
            <span>Обновить таблицу (авт. обновление каждые 120 сек.)</span>
          }
        >
          <Button
            onClick={() => actions.refetchDataSchedules()}
            disabled={loading.schedules}
            icon={<SyncOutlined spin={loading.schedules} />}
            title="Обновить таблицу"
          />
        </Popover>
        <Button
          icon={hiddenUserInfo ? <CompressOutlined /> : <ExpandOutlined />}
          title="Расширить таблицу"
          onClick={handleHiddenUserInfo}
        />
      </Flex>
      <div style={{ overflow: "auto" }}>
        <Suspense>
          <Table
            pagination={false}
            dataSource={filteredSchedules}
            columns={columns}
            size="small"
            rowKey={"id"}
            loading={loading.schedules || pending}
            expandable={{
              expandedRowRender: (record) => <UserRecallInfo record={record} />,
              rowExpandable: (record) => record.isRecall === true,
            }}
          />
        </Suspense>
      </div>
    </Flex>
  );
});
export default TableData;
