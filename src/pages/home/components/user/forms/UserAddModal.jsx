// Компонент для контейнера модального окна добавления задачи
/**
 * UserAddModal — кнопка + модальное окно для добавления новой задачи пользователю.
 * При клике открывается форма добавления задачи.
 * Использует Ant Design Button и Modal, похоже на CompletedStatisticsTrigger.
 */
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import UserAddForm from "./UserAddForm";

const UserAddModal = React.memo(({ selectedUser }) => {
    // Состояние открытия модального окна
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button 
                className="action-main"
                type="primary"
                block
                icon={<AppstoreAddOutlined />}
                iconPosition="end"
                disabled={!selectedUser}
                onClick={() => setOpen(true)}
                title="Добавить новую задачу в расписание на выбранного сотрудника"
            >
                Добавить в расписание
            </Button>
            <Modal
                title="Добавление новой задачи"
                open={open}
                onCancel={()=>setOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <UserAddForm
                    selectedUser={selectedUser}
                    handleModalClose={()=>setOpen(false)}
                />
            </Modal>
        </>
    );
});

export default UserAddModal;