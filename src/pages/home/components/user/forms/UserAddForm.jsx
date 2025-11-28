/**
 * UserAddForm — форма для добавления новой задачи сотруднику (отпуск, стажировка и т.д.)
 * 
 * Использует Ant Design компоненты для UI.  
 * - Выводит данные выбранного пользователя через CardUserInfo.
 * - Валидация и отправка данных через хук useSchedule.
 * - Все сообщения и ошибки показываются через контекст useCustomMessage.
 * 
 * Входные пропсы:
 * - selectedUser: объект пользователя, для которого оформляется задача
 * - handleModalClose: функция для закрытия модального окна после добавления задачи
 * 
 * Все стили оформлены через styled-components.
 */
import React from "react";
import dayjs from "dayjs";
import { 
    Button,
    Flex,
    Form,
    Input,
    Select,
    DatePicker,
    Space,
    Typography
} from "antd";
import { FieldTimeOutlined, FileTextOutlined, SolutionOutlined, ReadOutlined } from "@ant-design/icons";
import { useCustomMessage } from "../../../../../context/MessageContext";
import CardUserInfo from "./CardUserInfo";
import { useSchedule } from '../../../../../hooks/api/useSchedule';
import styled from "styled-components";

const {RangePicker} = DatePicker;
const {Title} = Typography;

const StyledTitleText = styled(Title)`
    && {margin:0;}
`;

const SELECT_OPTIONS = [
    {value: 'OTPYSK', label: 'Отпуск'},
    {value: 'STAJIROVKA', label: 'Стажировка'},
    {value: 'PRODLENIE_OTPYSKA', label: 'Продление'},
    {value: 'KOMANDIROVKA', label: 'Командировка'},
    {value: 'UCHEBA', label: 'Учеба'},
    {value: 'DEKRET', label: 'Декрет'},
]

const UserAddForm = React.memo(({selectedUser, handleModalClose}) => {
    const {msgError, msgSuccess} = useCustomMessage();
    const {actions, loading} = useSchedule({
        onError: (error) => msgError(`Ошибка при работе с Задачами: ${error.message || error}`)
    });

    // submit перация формы
    const onFinish = async (values)=> {
        try {
            await actions.createSchedule({ 
                data: {
                    fio: values.fio,
                    login: values.login,
                    type: values.type,
                    order: values.order,
                    startDate: values.startDate[0].format('YYYY-MM-DD'),
                    endDate: values.startDate[1].format('YYYY-MM-DD'),
                    description: values.description
                } 
            });
            msgSuccess('Задача успешно добавлена.');
            handleModalClose();
        }
        catch(err) {
            msgError(`Ошибка при добавлении задачи: ${err.message}`);
        }
    }

    return (
        <Form
            name="add-task-form"
            onFinish={onFinish}
            disabled={loading.create}
            style={{backgroundColor:'rgba(170, 210, 235, 0.17)', padding:'10px', borderRadius:'8px'}}
        >
            <CardUserInfo selectedUser={selectedUser}/>
            <Form.Item
                label={<StyledTitleText level={5}>Куда <SolutionOutlined/></StyledTitleText>}
                layout="vertical"
                name="type"
                rules={[{ required: true, message: 'Выберите тип задачи' }]}
                style={{flex:1, marginBottom:10}}
                initialValue={'OTPYSK'} 
            >
                <Select options={SELECT_OPTIONS}/>
            </Form.Item>
            <Flex gap={5}>
                <Form.Item
                    layout="vertical"
                    label={<StyledTitleText level={5}>Период <FieldTimeOutlined/></StyledTitleText>}
                    name="startDate"
                    rules={[{ required: true, message: 'Введите даты' }]}
                    style={{flex:1, marginBottom:10}}
                    initialValue={[dayjs(), dayjs()]}
                >
                    <RangePicker placeholder={['Дата начала', 'Дата окончания']} format="DD.MM.YYYY"/>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label={<StyledTitleText level={5}>Приказ <FileTextOutlined/></StyledTitleText>}
                    name="order"
                    rules={[{ required: true, message: 'Введите приказ' }]}
                    style={{flex:0.5, marginBottom:10}}
                >
                    <Input placeholder="1122-K"/>
                </Form.Item>
            </Flex>
            <Form.Item
                layout="vertical"
                label={<StyledTitleText level={5}>Описание <ReadOutlined/></StyledTitleText>}
                name="description"
                style={{flex:1, marginBottom:10}}
            >
                <Input.TextArea rows={4} placeholder="Примечание к записи..."/>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', margin:0 }}>
                <Space>
                    <Button onClick={handleModalClose} >Отмена</Button>
                    <Button type="primary" htmlType="submit" loading={loading.create}>Добавить</Button>
                </Space>
            </Form.Item>
        </Form>
    );
});

export default UserAddForm;