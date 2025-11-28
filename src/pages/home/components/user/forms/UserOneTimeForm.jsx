/**
 * UserOneTimeForm — форма для добавления разовой задачи пользователю.
 * 
 * Компонент отображает форму с информацией по пользователю и полями для выбора даты и действия (блокировка/разблокировка).
 * Использует Ant Design Form, DatePicker, Radio, стилизует с помощью Flex.
 * После успешного добавления вызывает handleModalClose и показывает уведомление.
 *
 * @component
 * @param {object} props - свойства компонента
 * @param {object} props.selectedUser - объект выбранного пользователя (login, fio и др.)
 * @param {function} props.handleModalClose - функция для закрытия окна после добавления задачи
 *
 * @example
 * <UserOneTimeForm 
 *    selectedUser={user} 
 *    handleModalClose={() => setOpen(false)}
 * />
 */
import React from "react";
import dayjs from "dayjs";
import { 
    Flex,
    Form,
    DatePicker,
    Radio,
    Space,
    Button
} from "antd";
import { ScheduleOutlined, InteractionOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../../context/MessageContext";
import CardUserInfo from "./CardUserInfo";
import { useOneTime } from "../../../../../hooks/api/useOneTime";

const UserOneTimeForm = React.memo(({selectedUser, handleModalClose}) => {
    const {msgError, msgSuccess} = useCustomMessage()
    const {actions, loading} = useOneTime({
        onError: (error) => msgError(`Ошибка при работе с Разовыми задачами: ${error.message || error}`)
    })

    // submit операция формы
    const onFinish =  async (values) => {
        try {
            await actions.createOneTime({ 
                data: {
                    fio: values.fio,
                    state: values.state,
                    date: values.date.format('YYYY-MM-DD'),
                    login: values.login,
                } 
            });
            msgSuccess('Разовая задача успешно добавлена');
            handleModalClose();
        }
        catch(err) {
            msgError(`Ошибка при добавлении задачи: ${err}`);
        }
    };

    return (
        <Form
            name="add-onetime-task-form"
            onFinish={onFinish}
            disabled={loading.create}
            layout="vertical"
            style={{backgroundColor:'rgba(170, 210, 235, 0.17)', padding:'10px', borderRadius:'8px'}}
        >
            <CardUserInfo selectedUser={selectedUser}/>
            <Flex vertical style={{border:'1px solid lightgray', borderRadius:'8px', padding:'10px', marginBottom:'10px'}}>
                <Flex justify="space-around">
                    <Form.Item
                        initialValue={dayjs()}
                        label={<h4>Дата <ScheduleOutlined/></h4>}
                        name="date"
                        rules={[{ required: true, message: 'Введите дату' }]}
                        style={{margin:0}}
                    >
                        <DatePicker format='DD.MM.YYYY'/>
                    </Form.Item>
                    <Form.Item
                        label={<h4>Действие <InteractionOutlined/></h4>}
                        name="state"
                        initialValue={true}
                        rules={[{ required: true, message: 'Выберите действие' }]}
                        style={{margin:0}}
                    >
                        <Radio.Group optionType="button" >
                            <Radio value={true} style={{color:'rgba(39, 132, 56, 0.73)'}}>Включить</Radio>
                            <Radio value={false} style={{color:'rgba(249, 0, 0, 0.59)'}}>Выключить</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Flex>
                <span style={{color:'gray', padding:'5px 15px', fontSize:'12px'}}>в выбранную дату пользователь будет Включен либо Выключен*</span>
            </Flex>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', margin:0 }}>
                <Space>
                    <Button onClick={handleModalClose} >Отмена</Button>
                    <Button type="primary" htmlType="submit">Добавить</Button>
                </Space>
            </Form.Item>
        </Form>
    )
})

export default UserOneTimeForm;