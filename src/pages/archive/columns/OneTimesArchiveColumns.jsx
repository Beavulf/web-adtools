import React from "react";
import { Tag } from "antd";

// Колонки для таблицы одноразовых задач (OneTimes) в архиве
// Выстроены по аналогии со ScheduleArchiveColumns/RecallArchiveColumns
// Предполагаемые поля записи OneTime: fio/login (если есть связь с пользователем),
// order, startDate, endDate, status, createdAt, createdBy, description
// Если в ваших запросах имена отличаются — замените dataIndex соответствующим образом.

const oneTimesArchiveColumns = [
  {
    title: "ФИО",
    dataIndex: ["user", "fio"],
    key: "fio",
    render: (_, record) => record?.user?.fio || record?.fio || "-",
    sorter: (a, b) => (a?.user?.fio || a?.fio || "").localeCompare(b?.user?.fio || b?.fio || "", "ru", { sensitivity: "base" }),
    ellipsis: true,
  },
  {
    title: "Логин",
    dataIndex: ["user", "login"],
    key: "login",
    render: (_, record) => record?.user?.login || record?.login || "-",
    sorter: (a, b) => (a?.user?.login || a?.login || "").localeCompare(b?.user?.login || b?.login || "", "en", { sensitivity: "base" }),
    width: 130,
    ellipsis: true,
  },
  {
    title: "Приказ",
    dataIndex: "order",
    key: "order",
    sorter: (a, b) => (a.order || "").localeCompare(b.order || "", "ru", { sensitivity: "base" }),
    width: 120,
    ellipsis: true,
  },
  {
    title: "Дата с",
    dataIndex: "startDate",
    key: "startDate",
    render: (text) => {
      if (!text) return "-";
      const d = new Date(text);
      return <span>{isNaN(d) ? "-" : d.toLocaleDateString()}</span>;
    },
    sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    width: 110,
  },
  {
    title: "Дата по",
    dataIndex: "endDate",
    key: "endDate",
    render: (text) => {
      if (!text) return "-";
      const d = new Date(text);
      return <span>{isNaN(d) ? "-" : d.toLocaleDateString()}</span>;
    },
    sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    width: 110,
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (text) =>
      text ? (
        <Tag color="green">Выполняется</Tag>
      ) : (
        <Tag color="orange">Ожидание</Tag>
      ),
    width: 120,
    sorter: (a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1),
  },
  {
    title: "Создана",
    dataIndex: "createdBy",
    key: "createdBy",
    render: (text) => <span style={{ color: "gray" }}>{text}</span>,
    sorter: (a, b) => (a.createdBy || "").localeCompare(b.createdBy || "", "en", { sensitivity: "base" }),
    ellipsis: true,
  },
  {
    title: "Дата созд.",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => {
      if (!text) return "-";
      const d = new Date(text);
      if (isNaN(d)) return "-";
      return <span>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</span>;
    },
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    ellipsis: true,
  },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
    render: (text) => (text ? text : "-"),
    width: 160,
    ellipsis: true,
  },
];

export default oneTimesArchiveColumns;
