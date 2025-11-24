/**
 * UserInfo — компонент отображения подробной информации о выбранном пользователе.
 * 
 * Показывает карточку с основными данными сотрудника и доступными действиями.
 * Использует компоненты Ant Design (Flex, Card, Tag, Typography, Image).
 * 
 * Пропсы:
 * - selectedUser: объект пользователя из Active Directory (или null/undefined)
 * - hidden: boolean — прятать или показывать компонент (например, при отсутствии выбора)
 * - onTableSearch: функция — обработчик поиска по таблице расписания по логину пользователя
 * 
 * @component
 */

import React, {useMemo} from "react"
import { 
    Flex,
    Tag,
    Card,
    Typography,
    Image
} from "antd"
import InfoBlock from "./InfoBlock"
import UserInfoAction from "./UserInfoAction"
import './UserInfo.css'

const {Title, Text} = Typography

const EMPTY_USER_DATA = {
    cn: 'Выберите сотрудника',
    distinguishedName: 'Путь в АД',
    company: '-',
    department: '-',
    description: '-',
    memberOf: '-',
    title: '-',
    login: '-',
    isActive: '-'
}

const transformUserData = (selectedUser) => {
    if (!selectedUser) {
        return EMPTY_USER_DATA
    }
    
    return {
        cn: selectedUser.cn,
        distinguishedName: selectedUser.distinguishedName,
        company: selectedUser.company,
        department: selectedUser.department,
        description: selectedUser.description,
        memberOf: selectedUser.memberOf,
        title: selectedUser.title,
        login: selectedUser.sAMAccountName,
        isActive: String(selectedUser.userAccountControl) === '512' ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'
    }
}

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    width: '100%',
    alignItems: 'stretch'
}

const UserInfo = React.memo(({selectedUser, hidden, onTableSearch}) => {
    const userData = useMemo(() => transformUserData(selectedUser), [selectedUser]);

    return (
        <Flex gap={10} className={hidden ? 'user-info-hidden' : 'user-info-container'}>
            {/* блок с информацией о пользователе */}
            <Card 
                className={selectedUser ? 'user-info selected' : 'user-info'}
                title={
                    <Flex gap={10} align="center">
                        <Image preview={false} src="/Person.png" alt="icon"/>
                        <Flex vertical flex={1}>
                            <Title level={4} className={selectedUser ? "text-fade-in" : ''}>{userData.cn}</Title>
                            <Text 
                                className={selectedUser ? "text-fade-in" : ''} 
                                copyable
                                ellipsis
                                style={{fontSize:'12px', maxWidth:'500px', color:'gray'}}
                            >
                                {userData.distinguishedName}
                            </Text>
                        </Flex>
                    </Flex>
                }
                extra={
                    <Tag  
                        bordered={true} 
                        color={userData.isActive === 'ВКЛЮЧЕНА' ? 'green' : userData.isActive === '-'?'orange' :'red'}>
                        <Title title="На момент поиска" level={5} style={{margin:0}} className={selectedUser ? "text-fade-in" : ''}>
                            {userData.isActive}
                        </Title>
                    </Tag>
                }
            >
                <div style={gridStyle}>
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.department} 
                        title="Отдел" 
                        iconSrc="/Otdel.png"
                        helpText="Параметр в АД - department"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.title} 
                        title="Должность" 
                        iconSrc="/Title.png"
                        helpText="Параметр в АД - title"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.login} 
                        title="Логин" 
                        iconSrc="/UserLogin.png"
                        helpText="Параметр в АД - sAMAccountName"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.description} 
                        title="Описание" 
                        iconSrc="/Description.png"
                        helpText="Параметр в АД - description"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.company} 
                        title="Компания" 
                        iconSrc="/Company.png"
                        helpText="Параметр в АД - company"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.memberOf} 
                        title="Группы" 
                        iconSrc="/Member.png"
                        helpText="Параметр в АД - memberOf"
                    />
                </div>
            </Card>

            {/* блок с кнопками действий */}
            <Card 
                style={{flex:'0 0 400px', height:'300px', width:'400px'}} 
                styles={{body:{height: '100%', display: 'flex', flexDirection: 'column'}}}
            >
                <UserInfoAction selectedUser={selectedUser} onTableSearch={onTableSearch}/>
            </Card>
        </Flex>
    )
});

export default UserInfo;