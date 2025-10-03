import React from "react";
import { 
    Button,
    Flex,
    Space
} from "antd"
import { FileSearchOutlined, SearchOutlined, AppstoreAddOutlined, FileAddOutlined } from "@ant-design/icons";
import './UserInfo.css'

const UserInfoAction = ()=> {
    return (
        <Flex vertical gap={10} style={{flex:1, marginBottom:'11px', marginTop:'11px'}}>
            <Flex vertical flex={1} gap={10}>
                <Button 
                    className="action-main"
                    type="primary" 
                    block 
                    icon={<AppstoreAddOutlined/>} 
                    iconPosition="end" 
                >Добавить в расписание</Button>
                <Button 
                    type="dashed" 
                    block 
                    icon={<FileAddOutlined/>} 
                    iconPosition="end" 
                    style={{flex:1}}
                >Добавить разовую задачу</Button>
            </Flex>
            <Flex gap={10} flex={0.5} >
                <Button style={{height:'100%', whiteSpace:'normal'}} icon={<FileSearchOutlined/>} iconPosition="end" >Просмотреть историю</Button>
                <Button style={{height:'100%', whiteSpace:'normal'}} icon={<SearchOutlined/>} iconPosition="end">Найти в расписании</Button>
            </Flex>
        </Flex>
    )
}
export default UserInfoAction;