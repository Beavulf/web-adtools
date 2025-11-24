/**
 * FailedStatisticsTrigger — кнопка с бэйджем ошибок запуска расписаний.
 * 
 * При нажатии открывает модальное окно со списком невыполненных задач.
 * Бэйдж показывает их количество за сегодня.
 * 
 * Использует Ant Design (Flex, Popover, Badge, Button) и кастомные модули.
 */

import React, { useState, useEffect } from "react";
import { Flex, Popover, Badge, Button, Typography } from "antd";
import { FileExclamationOutlined } from "@ant-design/icons";
import FailedTaskModal from "./FailedTaskModal";
import fetchCronLogData from "../../../../utils/fetchCronLogData";
import dayjs from "dayjs";

const { Text } = Typography;

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const FailedStatisticsTrigger = React.memo(() => {
    // Состояние открытия диалога
    const [open, setOpen] = useState(false);
    // Счётчик количества задач с ошибкой
    const [countRecordsBadge, setCountRecordsBadge] = useState(0);

    // Загружаем количество неуспешных задач за сегодня при маунте
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCronLogData(
                    `${SERVER_URL}api/logs/not-found/`,
                    dayjs().format('YYYY-MM-DD')
                );
                setCountRecordsBadge(data.length);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <Flex style={{ height: '100%', flex: 0.2 }}>
            <Badge style={{ padding: '0 3px' }} size="small" count={countRecordsBadge}>
                <Popover 
                    placement="left" 
                    content={<Text>Просмотреть список задач которые не выполнились</Text>}
                >
                    <Button 
                        icon={<FileExclamationOutlined />} 
                        onClick={() => setOpen(true)}
                    />
                </Popover>
            </Badge>
            {/* Модальное окно со списком ошибок */}
            <FailedTaskModal isOpen={open} onCancel={() => setOpen(false)} />
        </Flex>
    );
});

export default FailedStatisticsTrigger;
