import React, {} from "react";
import { 
    Flex,
    Form,
    Input,
    Card,
    Tag,
} from "antd"
import { UserOutlined } from "@ant-design/icons";

const CardUserInfo = React.memo(({selectedUser}) => { 
    return (
        <Card
                title={<h4>Выбранный сотрудник <UserOutlined/></h4>}
                style={{
                    background: 'linear-gradient(90deg, #e5d7ea 0%, #d1e7fa 50%, #d7f5e5 100%)',
                    marginBottom:'10px'
                }}
                extra={<Tag color="blue">{selectedUser?.department}</Tag>}
            >
                <Flex gap={10}>
                    <Form.Item
                        label={null}
                        name="fio"
                        rules={[{ required: true, message: 'Введите ФИО' }]}
                        style={{flex:1, marginBottom:10}}
                        initialValue={selectedUser?.cn}
                    >
                        <Input readOnly variant="filled" size="middle"/>
                    </Form.Item>
                    <Form.Item
                        style={{flex:0.4, marginBottom:10}}
                        name="login"
                        label={null}
                        rules={[{ required: true, message: 'Введите логин' }]}
                        initialValue={selectedUser?.sAMAccountName}
                    >
                        <Input readOnly variant="filled" size="middle"/>
                    </Form.Item>
                </Flex>
            </Card>
    )
})

export default CardUserInfo;