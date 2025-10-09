import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { 
    notification, 
    Space,
    Layout,
    Menu,
    Popover,
    Input,
    Card,
    Empty,
    Flex,
    Typography,
    Collapse
} from "antd";
import { SettingOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { gql } from '@apollo/client'
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { useAuth } from "../../context/AuthContext";
import UserCard from "./components/user/UserCard";
import UserInfo from "./components/user/UserInfo";
import FooterInfo from "./components/layout/FooterInfo";
import TableData from "./components/schedule/TableData";
import {CustomMessageProvider} from "../../context/MessageContext";
import "./Home.css"


const LOGOUT_USER = gql`
    mutation {
        logout
    }
`;

const GET_USER_LDAP = gql`
    query GetUsersLdap($cnOrSAMA: String!) {
        searchUser(data: {cnOrSamaccountname: $cnOrSAMA}) {
        cn,
        sAMAccountName,
        distinguishedName,
        company,
        department,
        description,
        memberOf,
        title,
        userAccountControl
    }
}
`;

const items= [
    { key: '1', label: 'Главная' },
    { key: '2', label: 'Архив' },
    { key: '3', label: 'Отделы'}
]

const {Header, Sider, Content, Footer} = Layout;
const {Search} = Input
const {Text, Paragraph} = Typography

const HomePage = () => {
    const [logoutServer, {loading, error}] = useMutation(LOGOUT_USER);
    const { logout: logoutClient } = useAuth();
    const [hiddenUserInfo, setHiddenUserInfo] = useState(false)

    // выбранная карточка
    const [selectedUserCard, setSelectedUserCard] = useState(null)
    
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

    const handleHiddenUserChange = useCallback((value) => {
        // гарантируем, что React не увидит обновление состояния во время рендера TableData
        Promise.resolve().then(() => setHiddenUserInfo(value));
    }, []);

    // получение списка пользователей из LDAP
    const [getUserInfo,{data: dataUserInfo, loading: loadingUserInfo, error: errorUserInfo}] = useLazyQuery(GET_USER_LDAP);

    useEffect(()=>{
        if (errorUserInfo) {
            openNotification(`Ошибка при попытке получения информации о пользователе: ${errorUserInfo.message}`,'error')
        }
    },[errorUserInfo])
    //***********************************  

    // выбор карточки
    const handleSelectedCard = useCallback((cardKey) => {   
        setSelectedUserCard(prevSelected => cardKey === prevSelected ? null : cardKey)
    }, []);

    // выход из аккаунта
    const handleLogout = async () => {
        try {
            await logoutServer()
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
        <Layout style={{
                height: '100%', 
                background: 'linear-gradient(135deg,#91dce9 0%, #9992ed 50%, #a98ec4 100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.4s ease-out', 
                margin:0,
                padding:0,
                overflowX:'hidden'
            }}
        >
            <Header className="main-header-block">
                <Flex style={{width:'500px'}}>
                    <img src="./Logo.png" alt="logo" 
                        style={{
                            objectFit: 'contain',
                            width:'50px'
                        }}
                    />
                    <h2 className="main-logo-text">WEB AD Tools</h2>
                </Flex>
                <Menu 
                    mode='horizontal'
                    items={items}
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    style={{
                        flex:1,
                        minWidth: 0,
                        borderRadius:'8px',
                        backgroundColor:'transparent',
                        fontSize:'16px',
                        color:'white',
                        margin:'0 25px'
                    }}
                />

                <div style={{ display:'flex', gap:'10px'}}>
                    <Popover content={<b>Открыть настройки службы</b>}>
                        <SettingOutlined className="main-icon"/>
                    </Popover>
                    <Popover content={<b>Выйти из программы</b>} trigger={'hover'}>
                        <LogoutOutlined
                            className="main-icon"
                            onClick={handleLogout}
                        />
                    </Popover>
                </div>

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
                    {/* Блок поиска сотрудников */}
                    <Space direction='vertical' style={{
                        display:'flex',
                        padding:'20px',
                        flex:'0 0 auto'
                    }}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <Space direction='horizontal' size='small'>
                                <Popover content="Поиск сотрудников в АД">
                                    <SearchOutlined className="main-icon"/>
                                </Popover>
                                <h4 style={{fontSize:'24px',color:'rgb(255, 255, 255)'}}>Поиск сотрудников</h4>
                            </Space>
                            <h4 style={{margin:'5px 10px 0 auto',color:'white',fontSize:'20px', display:'flex', marginLeft:'auto'}}>
                                {dataUserInfo?.searchUser?.length}
                            </h4>
                        </div>
                        
                        <Search 
                            style={{marginRight:'10px'}}
                            placeholder="Поиск по ФИО, логин..." 
                            size="large"
                            loading={loadingUserInfo}
                            onSearch={async (value)=>{
                                await getUserInfo({
                                    variables:{cnOrSAMA: value}, fetchPolicy: 'network-only'
                                })
                            }}
                        />
                    </Space>

                    {/* список карточек найденных сотрудников */}
                    <div style={{
                        flex:'1 1 auto', 
                        overflowY:'auto', 
                        overflowX: 'hidden',
                        minHeight:0,
                    }}>
                        {dataUserInfo?.searchUser?.length > 0 ? 
                            (dataUserInfo?.searchUser?.map((userInfo,index)=>(
                                    <div 
                                        key={userInfo.sAMAccountName} 
                                        className="user-card-wrapper"
                                        style={{animationDelay: `${index*0.1}s`}}
                                        onClick={()=>handleSelectedCard(userInfo)}
                                    >
                                        <UserCard 
                                            isActive={userInfo.sAMAccountName === selectedUserCard?.sAMAccountName}
                                            // key={userInfo.sAMAccountName}
                                            fio={userInfo.cn}
                                            department={userInfo.department}
                                            description={userInfo.description}
                                            ribbonText={userInfo.userAccountControl === '512' ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}
                                        />
                                    </div>
                                )
                            )) : 
                                <div
                                    style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}
                                >
                                    <div className="empty-visible" style={{opacity: loadingUserInfo ? 0 : 1}}>
                                        <Empty style={{fontSize:'24px'}}
                                        />
                                    </div>
                                </div>
                            }
                    </div>
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
                                onError={(error) => { 
                                    openNotification(`Ошибка при попытке отображения данных в таблице: ${error}`,'error')
                                }}
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
                <FooterInfo  onError={(error) => { 
                    openNotification(`Ошибка при попытке получения информации о задаче: ${error}`,'error')
                 }}/>
            </Footer>
            <div style={{margin:'0 0 0 auto', color:'rgba(255, 255, 255, 0.31)', textAlign:'center'}}>
                Разработано: Цыганок Е.С. Дизайн совместно с Цыганок А.С.
            </div>
        </Layout>
    )
}

export default HomePage;