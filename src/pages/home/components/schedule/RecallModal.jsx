import React, {  } from "react";
import {
    Flex,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Space,
    Card,
    Typography
} from 'antd'
import { useCustomMessage } from "../../../../context/MessageContext";
import { UserOutlined, HistoryOutlined } from "@ant-design/icons";
import { useRecall } from "../../../../hooks/api/useRecall";
import dayjs from "dayjs";

const {RangePicker} = DatePicker
const {Text} = Typography
const labelType = {
    OTPYSK: 'отпуска',
    STAJIROVKA: 'стажировки',
    PRODLENIE_OTPYSKA: 'продления',
    KOMANDIROVKA: 'командировки',
    UCHEBA: 'учебы',
    DEKRET: 'декрета',
}

const RecallModal = React.memo(({isOpen, onCancel, record})=>{
    const {msgSuccess, msgError} = useCustomMessage()
    const {actions, loading } = useRecall();

    const onFinish = async (values) =>{
        try {
            await actions.createRecall({ 
                data: {
                    order: values.order,
                    startDate: values.date[0].format('YYYY-MM-DD'),
                    endDate: values.date[1].format('YYYY-MM-DD'),
                    description: values.description,
                },
                idSchedule: record.id 
            });
            msgSuccess('Отзыв успешно добавлен');
            onCancel();
        }
        catch(error) {
            msgError(`Ошибка при добавлении отзыва: ${error.message}`);
        }
    }

    return (
        <Modal
            title={<>Отзыв сотрудника <HistoryOutlined/></>}
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
            width={700}
        >
            <Form
                name="recall-form"
                onFinish={onFinish}
                disabled={loading.create}
                layout="vertical"
            >
                <Card
                    title={<Text><UserOutlined/> {record?.fio}</Text>}
                    extra={record?.login}
                    styles={{body:{paddingBottom:'10px'}}}
                >
                    <Flex vertical gap={10}>
                        <Space wrap style={{backgroundColor:'rgba(170, 210, 235, 0.1)', width:'100%', borderRadius:'8px', padding:'5px 10px', height:'40px'}}>
                            <Text style={{fontWeight:'bold', color:'gray'}}>Отозвать из:</Text>
                            <Text style={{color:'gray'}}>{labelType[record?.type] || 'неизвестного типа'} {record?.order},</Text>
                            <Text style={{color:'gray'}}>
                                в даты с {dayjs(record?.startDate).format('DD.MM.YYYY')} - {dayjs(record?.endDate).format('DD.MM.YYYY')}
                            </Text>
                        </Space>
                        <Flex gap={5}>
                            <Form.Item name='order' style={{flex:0.5, marginBottom:0}} 
                                rules={[{ required: true, message: 'Введите приказ, минимум 3 символа', min:3 }]}
                            >
                                <Input placeholder="Приказом..."/>
                            </Form.Item>
                            <Form.Item name='date' style={{flex:1, marginBottom:0}} 
                                rules={[{ required: true, message: 'Введите даты' }]}
                                initialValue={[dayjs(record?.startDate), dayjs(record?.endDate)]}
                            >
                                <RangePicker style={{width:'100%'}} format="DD.MM.YYYY"/>
                            </Form.Item>
                            
                        </Flex>
                        <Form.Item
                            name='description'
                            style={{flex:1, marginBottom:0}}
                            rules={[{ required: false, min: 6, message: 'Минимум 6 символов'}]}
                        >
                            <Input.TextArea rows={1} placeholder="Описание..."></Input.TextArea>
                        </Form.Item>
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', margin:0 }}>
                            <Space>
                                <Button onClick={onCancel}>Отмена</Button>
                                <Button type="primary" htmlType="submit" loading={loading.create} disabled={loading.create}>Отозвать</Button>
                            </Space>
                        </Form.Item>
                    </Flex>
                </Card>
            </Form>
        </Modal>
    )
})

export default RecallModal;