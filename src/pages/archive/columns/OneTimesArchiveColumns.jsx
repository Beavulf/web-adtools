import React from "react";
import { Tag } from "antd";

const oneTimesArchiveColumns = [
  {
    title: "ФИО",
    dataIndex: "fio",
    key: "fio",
    render: (_, record) => record?.user?.fio || record?.fio || "-",
    sorter: (a, b) => (a?.user?.fio || a?.fio || "").localeCompare(b?.user?.fio || b?.fio || "", "ru", { sensitivity: "base" }),
    ellipsis: true,
  },
  {
    title: "Логин",
    dataIndex: "login",
    key: "login",
    render: (_, record) => record?.user?.login || record?.login || "-",
    sorter: (a, b) => (a?.user?.login || a?.login || "").localeCompare(b?.user?.login || b?.login || "", "en", { sensitivity: "base" }),
    ellipsis: true,
  },
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
    render: (text) => {
      if (!text) return "-";
      const d = new Date(text);
      return <span>{isNaN(d) ? "-" : d.toLocaleDateString()}</span>;
    },
    sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    width: 110,
  },
  {
    title: "Статус",
    dataIndex: "isCompleate",
    key: "isCompleate",
    render: (text) =>
      text ? (
        <Tag color="green">Выполнена</Tag>
      ) : (
        <Tag color="orange">Ожидание</Tag>
      ),
    sorter: (a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1),
  },
  {
    title: "Действие",
    dataIndex: "state",
    key: "state",
    render: (text) =>
      text ? (
        <Tag color="green">Включить</Tag>
      ) : (
        <Tag color="orange">Выключить</Tag>
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

export default oneTimesArchiveColumns;
