import React from "react";
import { Tag } from "antd";

// Колонки для таблицы Recall (отзывов) по аналогии с ScheduleArchiveColumns
// Поля взяты из GET_RECALLS/GET_ARCHIVE_RECALLS: fio/login (из schedule), order, startDate, endDate,
// status, createdAt, createdBy, description

const recallColumns = [
  {
    title: "ID",
    dataIndex: "scheduleId",
    key: "scheduleId",
    // render: (_, record) => record?.schedule?.fio || "-",
    sorter: (a, b) => (a?.schedule?.fio || "").localeCompare(b?.schedule?.fio || "", "ru", { sensitivity: "base" }),
    ellipsis: true,
  },
  {
    title: "Логин",
    dataIndex: ["schedule", "login"],
    key: "login",
    render: (_, record) => record?.schedule?.login || "-",
    sorter: (a, b) => (a?.schedule?.login || "").localeCompare(b?.schedule?.login || "", "en", { sensitivity: "base" }),
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
    title: "Обновлена",
    dataIndex: "updatedBy",
    key: "updatedBy",
    render: (text) => <span style={{ color: "gray" }}>{text}</span>,
    sorter: (a, b) => (a.createdBy || "").localeCompare(b.createdBy || "", "en", { sensitivity: "base" }),
    ellipsis: true,
  },
  {
    title: "Дата изм.",
    dataIndex: "updatedAt",
    key: "updatedAt",
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

export default recallColumns;
