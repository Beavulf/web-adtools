/**
 * @file Home.jsx
 * @description
 * Главная страница приложения WEB AD Tools.
 * Здесь происходит отображение основной структуры: сайдбар, шапка, таблица пользователей, инфо о пользователе, футер.
 * Подключаются основные контекстные провайдеры (авторизация, нотификации, сообщения), а также все необходимые компоненты Ant Design.
 * Данные пользователей получаются через LDAP (кастомный хук useLdap).
 * UI разбивается на отдельные компоненты по разделам для упрощения поддержки кода.
 */

import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { 
    notification, 
    Layout,
    Card,
    Flex,
    Typography,
    Popover
} from "antd";
import { useAuth } from "../../context/AuthContext";
import UserInfo from "./components/user/UserInfo";
import FooterInfo from "./components/layout/FooterInfo";
import TableData from "./components/schedule/TableData";
import { CustomMessageProvider } from "../../context/MessageContext";
import { useLdap } from "../../hooks/api/useLdap";
import MainHeader from "./components/layout/MainHeader.jsx";
import MainSider from "./components/layout/MainSider.jsx";
import "./Home.css";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography

const HomePage = () => {
    const { logout: logoutClient } = useAuth();
    const { actions } = useLdap({
        onError: (error) => {
            openNotification(`Ошибка при работе с LDAP: ${error}`,'error')
        } 
    });
    // выбранная карточка
    const [selectedUserCard, setSelectedUserCard] = useState(null)
    // отображение информации о пользователе
    const [hiddenUserInfo, setHiddenUserInfo] = useState(false)
    
    // значение для поиска в таблице переданные через пропсы другого компонента
    const [tableSearchValue, setTableSearchValue] = useState("")
    const handleTableSearch = useCallback((searchValue) => {
        setTableSearchValue(searchValue);
    }, []);
    
    // уведомления
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (text,type) => {
        api.open({
        message: 'Оповещение',
        description: text,
        showProgress: true,
        pauseOnHover: true,
        placement: 'bottom',
        type
    })
}
    // анимация загрузки страницы
    const [isVisible, setIsVisible] = useState(false)
    useEffect(()=>{
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    },[])

    // для оптимизации прогрузки таблицы
    const handleHiddenUserChange = useCallback((value) => {
        // гарантируем, что React не увидит обновление состояния во время рендера TableData
        Promise.resolve().then(() => setHiddenUserInfo(value));
    }, []);

    // выбор карточки
    const handleSelectedCard = useCallback((cardKey) => {   
        setSelectedUserCard(prevSelected => cardKey === prevSelected ? null : cardKey)
    }, []);

    // выход из аккаунта, на сервере анулирование токена и на клиенте
    const handleLogout = async () => {
        try {
            await actions.logout()
            logoutClient()
       }
        catch(err) {
            openNotification(`Ошибка при попытке выхода из аккаунта: ${err.message}`,'error')
        }
        finally {
            logoutClient()
        }
    }

    return (
        <Layout 
            style={{
                height: '100%', 
                background: 'linear-gradient(135deg,#91dce9 0%, #9992ed 50%, #a98ec4 100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.4s ease-out', 
                overflowX:'hidden'
            }}
        >
            <Header className="main-header-block">
                <MainHeader handleLogout={handleLogout}/>
            </Header>
            
            <Layout style={{ background: 'transparent', height:'100%'}}>
                {/* SIDER */}
                <Sider className="main-block sider-scroll" width={500}
                    style={{ 
                        display:'flex', 
                        overflow:'hidden',  
                        flexDirection:'column',
                        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.3s ease-out',
                    }}
                >
                    <MainSider 
                        handleSelectedCard={handleSelectedCard} 
                        selectedUserCard={selectedUserCard} 
                        openNotification={openNotification}
                    />
                </Sider>
                
                <CustomMessageProvider>
                    <Content 
                        className="main-block"
                        style={{
                            marginLeft: 0,
                            transform: isVisible ? 'translateX(0)' : 'translateX(300px)',
                            transition: 'transform 0.3s ease-out',
                            gap:'10px',
                            display:'flex',
                            flexDirection:'column',
                            padding:'10px',
                        }}
                    >
                        {contextHolder}

                        {/* блоки с информацией о пользователе и кнопками добавления задач */}
                        <UserInfo 
                            selectedUser={selectedUserCard} 
                            hidden={hiddenUserInfo}
                            onTableSearch={handleTableSearch}
                        />

                        <Card style={{
                            overflow: 'auto',
                            flex: 1,
                            minHeight: 0,
                        }}>
                            <TableData 
                                onHidden={handleHiddenUserChange}
                                searchValue={tableSearchValue}
                            />
                        </Card>
                    </Content>
                </CustomMessageProvider>
            </Layout>

            {/* футер */}
            <Footer className="main-footer-block"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s ease-out',
                    overflow:'hidden'
                }}
            >
                <FooterInfo notification={openNotification}/>
            </Footer>
            <Flex justify="center">
                <Popover content={'Разработано: Цыганок Е.С. Дизайн совместно с Цыганок А.С.'}>
                    <Text style={{margin:0, fontSize:'12px', color:'lightgray'}}>РАЗРАБОТАНО</Text>
                </Popover>
            </Flex>
        </Layout>
    )
}

export default HomePage;