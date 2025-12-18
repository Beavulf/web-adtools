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
  Popover,
  Checkbox
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
import styled from "styled-components";

// StyledTable применяет стиль для чётных и нечётных строк тела таблицы
const StyledTable = styled(Table)`
  .ant-table-tbody > tr:nth-child(odd) {
    background: ${({ isColored }) => isColored ? "#fff" : "inherit"};
  }
  .ant-table-tbody > tr:nth-child(even) {
    background: ${({ isColored }) => isColored ? "rgba(127, 162, 219, 0.09)" : "inherit"};
  }
`;


const { Search } = Input;

const TableData = React.memo(({ onHidden, searchValue }) => {
  const { msgError } = useCustomMessage();
  const [confirmTextValue, setConfirmTextValue] = useState("");
  const [hiddenUserInfo, setHiddenUserInfo] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [pending, startTransition] = useTransition();
  const [isColored, setIsColored] = useState(false);

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
          placeholder="Поиск (Enter, Esc сбросить) по ФИО, логину, датам (дд.мм.гггг, либо диапазон дд.мм.гггг-дд.мм.гггг), приказу, описанию..."
          onSearch={handleSearch}
          allowClear
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleSearch('');
          }}
          disabled={pending}
          style={{flex:1}}
        />
        <Popover content={<span>Тестовая функция раскраски строк в таблице.</span>}>
          <Button style={{padding:'10px'}}>
            <Checkbox checked={isColored} onChange={(e) => setIsColored(e.target.checked)}/>
          </Button>
        </Popover>
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
          <StyledTable
            isColored={isColored}
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
