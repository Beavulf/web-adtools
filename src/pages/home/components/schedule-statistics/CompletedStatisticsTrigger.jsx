/**
 * CompletedStatisticsTrigger — кнопка для просмотра выполненных задач за сегодня.
 * 
 * При нажатии открывает модальное окно со списком выполненных задач.
 * Использует Ant Design (Flex, Popover, Button, Typography) и кастомные модули.
 */

import React, { useState } from "react";
import { Flex, Popover, Button, Typography } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import CompletedTaskModal from "./CompletedTaskModal";

const { Text } = Typography;

const CompletedStatisticsTrigger = React.memo(() => {
    // Состояние для открытия/закрытия модального окна
    const [open, setOpen] = useState(false);

    return (
        <Flex style={{ height: '100%', flex: 0.2 }}>
            <Popover placement="left" content={<Text>Просмотреть список задач выполненных сегодня</Text>}>
                <Button
                    icon={<FileDoneOutlined />}
                    style={{ height: '100%' }}
                    onClick={() => setOpen(true)}
                ></Button>
            </Popover>
            {/* Модальное окно со списком выполненных задач */}
            <CompletedTaskModal isOpen={open} onCancel={() => setOpen(false)} />
        </Flex>
    );
});

export default CompletedStatisticsTrigger;
