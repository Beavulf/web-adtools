/**
 * AllOneTimeTrigger — кнопка для просмотра всех разовых задач сотрудников.
 * 
 * При нажатии открывает модальное окно со списком разовых задач.
 * Использует Ant Design (Flex, Popover, Button, Typography) и собственный AllOneTimeModal.
 */

import React, { useState } from "react";
import { Flex, Popover, Button, Typography } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import AllOneTimeModal from "./AllOneTimeModal";

const { Text } = Typography;

const AllOneTimeTrigger = React.memo(() => {
    // Состояние для открытия/закрытия модального окна разовых задач
    const [open, setOpen] = useState(false);

    return (
        <Flex style={{ height: '100%', flex: 0.2 }}>
            <Popover
                placement="left"
                content={<Text>Просмотреть список разовых задач</Text>}
            >
                <Button
                    icon={<ProfileOutlined />}
                    style={{ height: '100%' }}
                    onClick={() => setOpen(true)}
                />
            </Popover>
            {/* Модальное окно со всеми разовыми задачами */}
            <AllOneTimeModal
                onOpen={open}
                onCancel={() => setOpen(false)}
            />
        </Flex>
    );
});

export default AllOneTimeTrigger;