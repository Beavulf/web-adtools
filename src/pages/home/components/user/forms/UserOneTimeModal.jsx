/**
 * UserOneTimeModal — кнопка + модальное окно для добавления разовой задачи пользователю.
 * - Кнопка добавления разовой задачи. Она неактивна без выбранного пользователя.
 * - При клике открывается форма в модальном окне.
 * - Состояние открытия модального окна хранится внутри компонента.
 */
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import UserOneTimeForm from "./UserOneTimeForm";

/**
 * @param {object} props
 * @param {object} props.selectedUser - выбранный пользователь для формы
 */
const UserOneTimeModal = React.memo(({ selectedUser }) => {
    // Состояние для открытия/закрытия модального окна
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button 
                type="dashed"
                icon={<FileAddOutlined />}
                iconPosition="end"
                style={{ height: '100%', flex: 1, whiteSpace: 'normal' }}
                disabled={!selectedUser}
                onClick={() => setOpen(true)}
                title="Добавить разовую задачу на выбранного сотрудника"
            >
                Добавить разовую задачу
            </Button>
            <Modal
                title="Добавление разовой задачи"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <UserOneTimeForm 
                    selectedUser={selectedUser}
                    handleModalClose={() => setOpen(false)}
                />
            </Modal>
        </>
    );
});

export default UserOneTimeModal;