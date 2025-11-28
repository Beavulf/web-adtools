/**
 * MainHeaderContent — компонент для отображения логотипа, названия, меню и панели действий в хедере.
 *
 * Используй этот компонент внутри хедера. Все стили и разметка уже заданы.
 */
/**
 * @param {Object} props
 * @param {Array} props.items - массив пунктов меню
 * @param {Function} props.handleLogout - обработчик выхода пользователя
 */
import React from "react";
import { Menu, Popover, Flex } from "antd";
import GradientText from "../splash-text/GradientText";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import ServiceSettingsModal from "../service-settings/ServiceSettingsModal";

// пункты меню
const items = [
    { key: '1', label: 'Главная' },
    { key: '2', label: 'Архив' },
]

// легкий компонент для открытия модального окна настроек службы
function ServiceSettingsTrigger() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Popover content={<b>Открыть настройки службы</b>}>
                <SettingOutlined className="main-icon" onClick={()=>setOpen(true)} />
            </Popover>
            <ServiceSettingsModal isOpen={open} onCancel={()=>setOpen(false)} />
        </>
    );
}

function MainHeader({ handleLogout }) {
    return (
        // Flex-контейнер для главных блоков хедера
        <Flex align="center" justify="space-between" style={{ width: "100%" }}>
            {/* Логотип и надпись */}
            <Flex align="center" style={{ width: "500px" }}>
                <img
                    src="/Logo.png"
                    alt="logo"
                    style={{
                        objectFit: "contain",
                        width: "50px",
                    }}
                />
                <GradientText
                    colors={[
                        "rgb(64, 163, 255)",
                        "rgb(165, 160, 244)",
                        "rgb(64, 163, 255)",
                        "rgb(165, 160, 244)",
                        "rgb(64, 163, 255)",
                    ]}
                    animationSpeed={10}
                    showBorder={false}
                    className="main-logo-text"
                >
                    WEB AD Tools
                </GradientText>
            </Flex>

            {/* Меню навигации Ant Design */}
            <Menu
                mode="horizontal"
                items={items}
                theme="dark"
                defaultSelectedKeys={["1"]}
                style={{
                    flex: 1,
                    minWidth: 0,
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    fontSize: "16px",
                    color: "white",
                    margin: "0 25px",
                }}
            />

            {/* Блок кнопок справа: настройки сервиса и выход */}
            <div style={{ display: "flex", gap: "10px" }}>
                <ServiceSettingsTrigger />
                <Popover content={<b>Выйти из программы</b>}>
                    <LogoutOutlined
                        className="main-icon"
                        onClick={handleLogout}
                    />
                </Popover>
            </div>
        </Flex>
    );
}

export default MainHeader;
