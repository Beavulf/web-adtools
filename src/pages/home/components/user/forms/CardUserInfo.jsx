/**
 * Карточка информации о выбранном пользователе.
 * 
 * Показывает ФИО, логин и отдел пользователя в красивой карточке с градиентом.
 * Используется для отображения краткой информации при работе с формами.
 * Все поля только для чтения.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.selectedUser - выбранный пользователь (объект с cn, sAMAccountName, department и др.)
 */
import React from "react";
import { 
    Flex,
    Form,
    Input,
    Card,
    Tag,
    Typography
} from "antd"
import { UserOutlined } from "@ant-design/icons";

const {Title} = Typography;

const CardUserInfo = React.memo(({selectedUser}) => { 
    return (
        <Card
            title={<Title level={5}>Выбранный сотрудник <UserOutlined/></Title>}
            style={{
                background: 'linear-gradient(90deg, #e5d7ea 0%, #d1e7fa 50%, #d7f5e5 100%)',
                marginBottom:'10px',
            }}
            extra={<Tag color="blue">{selectedUser?.department || 'Отдел'}</Tag>}
            styles={{body:{padding:'5px 10px'}}}
        >
            <Flex gap={10}>
                <Form.Item
                    label={null}
                    name="fio"
                    style={{flex:1, marginBottom:10}}
                    initialValue={selectedUser?.cn || 'ФИО'}
                >
                    <Input readOnly variant="filled" size="middle"/>
                </Form.Item>
                <Form.Item
                    style={{flex:0.4, marginBottom:10}}
                    name="login"
                    label={null}
                    initialValue={selectedUser?.sAMAccountName || 'Логин'}
                >
                    <Input readOnly variant="filled" size="middle"/>
                </Form.Item>
            </Flex>
        </Card>
    )
})

export default CardUserInfo;