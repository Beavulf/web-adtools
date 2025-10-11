import React, {useEffect} from "react";
import dayjs from "dayjs";
import { 
    Button,
    Flex,
    Form,
    Input,
    Select,
    DatePicker,
    Space,
    Card,
    Tag
} from "antd"
import { useMutation } from "@apollo/client/react";
import { FieldTimeOutlined, FileTextOutlined, SolutionOutlined, ReadOutlined } from "@ant-design/icons";
import { GET_SCHEDULES, CREATE_SCHEDULE } from "../../../../../query/GqlQuery";
import { useCustomMessage } from "../../../../../context/MessageContext";
import CardUserInfo from "./CardUserInfo";

const {RangePicker} = DatePicker

const UserAddForm = React.memo(({selectedUser, handleModalClose}) => {
    const {msgError, msgSuccess} = useCustomMessage()

    const [createSchedule, { loading: loadingSchedule, error: errorSchedule }] = useMutation(CREATE_SCHEDULE, {
        refetchQueries: [
            { query: GET_SCHEDULES }
        ]
    });

    useEffect(() => {
        if (errorSchedule) {
            msgError(`Ошибка при добавлении задачи: ${errorSchedule.message}`);
        }
    },[errorSchedule])

    // submit перация формы
    const onFinish = async (values)=> {
        try {
            await createSchedule({ 
                variables: { 
                    data: {
                        fio: values.fio,
                        login: values.login,
                        type: values.type,
                        order: values.order,
                        startDate: values.startDate[0].format('YYYY-MM-DD'),
                        endDate: values.startDate[1].format('YYYY-MM-DD'),
                        description: values.description
                    } 
                } 
            });
            msgSuccess('Задача успешно добавлена');
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
            disabled={loadingSchedule}
            style={{backgroundColor:'rgba(170, 210, 235, 0.17)', padding:'10px', borderRadius:'8px'}}
        >
            <CardUserInfo selectedUser={selectedUser}/>
            <Form.Item
                label={<h4>Куда <SolutionOutlined/></h4>}
                layout="vertical"
                name="type"
                rules={[{ required: true, message: 'Выберите тип задачи' }]}
                style={{flex:1, marginBottom:10}}
                initialValue={'OTPYSK'}
            >
                <Select
                    options={[
                        {value: 'OTPYSK', label: 'Отпуск'},
                        {value: 'STAJIROVKA', label: 'Стажировка'},
                        {value: 'PRODLENIE_OTPYSKA', label: 'Продление'},
                        {value: 'KOMANDIROVKA', label: 'Командировка'},
                        {value: 'UCHEBA', label: 'Учеба'},
                        {value: 'DEKRET', label: 'Декрет'},
                    ]}
                />
            </Form.Item>
            <Flex gap={5}>
                <Form.Item
                    layout="vertical"
                    label={<h4>Период <FieldTimeOutlined/></h4>}
                    name="startDate"
                    rules={[{ required: true, message: 'Введите даты' }]}
                    style={{flex:1, marginBottom:10}}
                    initialValue={[dayjs(), dayjs()]}
                >
                    <RangePicker format="DD.MM.YYYY"/>
                </Form.Item>
                <Form.Item
                    layout="vertical"
                    label={<h4>Приказ <FileTextOutlined/></h4>}
                    name="order"
                    rules={[{ required: true, message: 'Введите приказ' }]}
                    style={{flex:0.5, marginBottom:10}}
                >
                    <Input placeholder="1122-K"/>
                </Form.Item>
            </Flex>
            <Form.Item
                layout="vertical"
                label={<h4>Описание <ReadOutlined/></h4>}
                name="description"
                style={{flex:1, marginBottom:10}}
            >
                <Input.TextArea rows={4} placeholder="Примечание к записи..."/>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                    <Button onClick={handleModalClose} >Отмена</Button>
                    <Button type="primary" htmlType="submit" loading={loadingSchedule}>Добавить</Button>
                </Space>
            </Form.Item>
        </Form>
    );
});

export default UserAddForm;