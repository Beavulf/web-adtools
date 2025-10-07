import React, {useEffect, useCallback} from "react";
import dayjs from "dayjs";
import { 
    Flex,
    Form,
    Input,
    DatePicker,
    Card,
    Tag,
    Radio,
    Space,
    Button
} from "antd"
import { useMutation } from "@apollo/client/react";
import { UserOutlined, ScheduleOutlined, InteractionOutlined } from "@ant-design/icons";
import { GET_SCHEDULES, CREATE_ONETIME_TASK } from "../../../../../query/GqlQuery";
import { useCustomMessage } from "../../../../../context/MessageContext";

const UserOneTimeForm = React.memo(({selectedUser, handleModalClose}) => {

    const {msgError, msgSuccess} = useCustomMessage()

    // создание разовой задачи
    const [createOneTime, { loading: loadingOneTime, error: errorOneTime }] = useMutation(CREATE_ONETIME_TASK, {
        refetchQueries: [
            { query: GET_SCHEDULES }
        ]
    });

    // отображение ошибке при ее появлении
    useEffect(() => {
        if (errorOneTime) {
            msgError(`Ошибка при добавлении задачи: ${errorOneTime.message}`);
        }
    },[errorOneTime])

    // submit перация формы
    const onFinish = useCallback(
        async (values) => {
            try {
                await createOneTime({ 
                    variables: { 
                        data: {
                            fio: values.fio,
                            state: values.state,
                            date: values.date.format('YYYY-MM-DD'),
                            login: values.login,
                        } 
                    } 
                });
                msgSuccess('Разовая задача успешно добавлена');
                handleModalClose();
            }
            catch(err) {
                msgError(`Ошибка при добавлении задачи: ${err.message}`);
            }
        },
        [createOneTime, handleModalClose]
    );

    return (
        <Form
            name="add-onetime-task-form"
            onFinish={onFinish}
            disabled={loadingOneTime}
            layout="vertical"
            style={{backgroundColor:'rgba(170, 210, 235, 0.17)', padding:'10px', borderRadius:'8px'}}
        >
            <Card
                title={<h4>Выбранный сотрудник <UserOutlined/></h4>}
                style={{
                    background: 'linear-gradient(90deg, #e5d7ea 0%, #d1e7fa 50%, #d7f5e5 100%)',
                    marginBottom:'10px'
                }}
                extra={<Tag color="blue">{selectedUser?.department}</Tag>}
            >
                <Flex gap={10} >
                    <Form.Item
                        name="fio"
                        rules={[{ required: true, message: 'Введите ФИО' }]}
                        style={{flex:1, marginBottom:10}}
                        initialValue={selectedUser?.cn}
                    >
                        <Input readOnly variant="filled"/>
                    </Form.Item>
                    <Form.Item
                        style={{flex:0.4, marginBottom:10}}
                        name="login"
                        label={null}
                        rules={[{ required: true, message: 'Введите логин' }]}
                        initialValue={selectedUser?.sAMAccountName}
                    >
                        <Input readOnly variant="filled"/>
                    </Form.Item>
                </Flex>
            </Card>
            <Flex justify="space-around" style={{border:'1px solid lightgray', borderRadius:'8px', padding:'10px', marginBottom:'10px'}}>
                <Form.Item
                    initialValue={dayjs()}
                    label={<h4>Дата <ScheduleOutlined/></h4>}
                    name="date"
                    rules={[{ required: true, message: 'Введите дату' }]}
                >
                    <DatePicker format='DD.MM.YYYY'/>
                </Form.Item>
                <Form.Item
                    label={<h4>Действие <InteractionOutlined/></h4>}
                    name="state"
                    initialValue={true}
                    rules={[{ required: true, message: 'Выберите действие' }]}
                >
                    <Radio.Group optionType="button">
                        <Radio value={true} style={{color:'rgba(39, 132, 56, 0.73)'}}> Включить </Radio>
                        <Radio value={false} style={{color:'rgba(249, 0, 0, 0.59)'}}> Выключить </Radio>
                    </Radio.Group>
                </Form.Item>
            </Flex>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                    <Button onClick={handleModalClose} >Отмена</Button>
                    <Button type="primary" htmlType="submit">Добавить</Button>
                </Space>
            </Form.Item>
        </Form>
    )
})

export default UserOneTimeForm;