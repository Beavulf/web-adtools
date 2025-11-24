/**
 * UserArchiveHistoryModal — кнопка + модальное окно для просмотра архивной истории задач пользователя.
 * - Кнопка открытия истории. Она неактивна без выбранного пользователя.
 * - При клике открывается модальное окно со списком архивных задач.
 * - Состояние открытия модального окна хранится внутри компонента.
 */
import React, { useState } from "react";
import { Button } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import UserArchiveHistory from "./UserArchiveHistory";

/**
 * @param {object} props
 * @param {string} props.sAMAccountName - логин пользователя для поиска истории
 */
const UserArchiveHistoryTrigger = React.memo(({ selectedUser }) => {
    // Состояние открытия/закрытия модального окна
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button 
                disabled={!selectedUser}
                style={{ height: '100%', whiteSpace: 'normal' }}
                icon={<FileSearchOutlined />}
                iconPosition="end"
                onClick={() => setOpen(true)}
                title="Просмотр архивной истории задач выбранного сотрудника"
            >
                Просмотреть историю
            </Button>

            <UserArchiveHistory
                sAMAccountName={selectedUser?.sAMAccountName}
                isOpen={open}
                onCancel={() => setOpen(false)}
            />
        </>
    );
});

export default UserArchiveHistoryTrigger;
                    