import React, {useEffect, useState} from "react"
import { 
    Flex,
    Tag,
    Card,
    Typography
} from "antd"
import InfoBlock from "./InfoBlock"
import UserInfoAction from "./UserInfoAction"
import './UserInfo.css'

const {Text, Paragraph} = Typography

const UserInfo = ({selectedUser}) => {
    const [userData, setUserData] = useState({})
    useEffect(()=>{
        if (selectedUser) {
            setUserData({
                cn: selectedUser.cn,
                distinguishedName: selectedUser.distinguishedName,
                company: selectedUser.company,
                department: selectedUser.department,
                description: selectedUser.description,
                memberOf: selectedUser.memberOf,
                title: selectedUser.title,
                login: selectedUser.sAMAccountName,
                isActive: selectedUser.userAccountControl === '512' ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'
            })
        } else {
            setUserData({
                cn: 'Выберите сотрудника',
                distinguishedName: 'Путь в АД',
                company: '-',
                department: '-',
                description: '-',
                memberOf: '-',
                title: '-',
                login: '-',
                isActive: '-'
            })
        }
    },[selectedUser])

    return (
        <Flex style={{gap:'10px'}}>
            <Card 
                className={selectedUser ? 'user-info selected' : 'user-info'}
                title={
                    <div style={{display:'flex', alignItems:'center', gap:'10px',}}>
                        <img src="./Person.png" alt="icon" style={{width:'64px', objectFit:'contain'}} />
                        <Flex vertical>
                            <h4 className={selectedUser ? "text-fade-in" : ''}>{userData.cn}</h4>
                            <Paragraph className={selectedUser ? "text-fade-in" : ''} copyable style={{color:'gray', fontSize:'12px', margin:0}}>{userData.distinguishedName}</Paragraph>
                        </Flex>
                    </div>
                }
                extra={<Tag  
                    bordered={true} 
                    color={userData.isActive === 'ВКЛЮЧЕНА' ? 'green' : userData.isActive === '-'?'orange' :'red'}>
                    <h4 className={selectedUser ? "text-fade-in" : ''}>{userData.isActive}</h4>
                </Tag>}
            >
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', width:'100%', alignItems:'stretch'}}>
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.department} 
                        title="Отдел" 
                        iconSrc="./Otdel.png"
                        helpText="Параметр в АД - department"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.title} 
                        title="Должность" 
                        iconSrc="./Title.png"
                        helpText="Параметр в АД - title"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.login} 
                        title="Логин" 
                        iconSrc="./UserLogin.png"
                        helpText="Параметр в АД - sAMAccountName"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.description} 
                        title="Описание" 
                        iconSrc="./Description.png"
                        helpText="Параметр в АД - description"
                    />
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.company} 
                        title="Компания" 
                        iconSrc="./Company.png"
                        helpText="Параметр в АД - company"
                    />
                    
                    <InfoBlock 
                        selectedUser={selectedUser} 
                        text={userData.memberOf} 
                        title="Группы" 
                        iconSrc="./Member.png"
                        helpText="Параметр в АД - memberOf"
                    />
                </div>
            </Card>
            <Card style={{flex:'0 0 400px', height:'300px', width:'400px'}} bodyStyle={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <UserInfoAction/>
            </Card>
        </Flex>
    )
}

export default UserInfo;