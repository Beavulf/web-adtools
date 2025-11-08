import React, {useState, useEffect} from "react";
import {
    Modal,
    Typography,
    Flex,
    List,
    Input
} from 'antd'
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";
import {useCustomMessage} from '../../../../context/MessageContext'
import fetchCronLogData from "../../../../utils/fetchCronLogData";

const {Text} = Typography;
const {Search} = Input;

const FailedTaskModal = React.memo(({isOpen, onCancel})=>{
    const [fileNotFoundData, setFileNotFoundData] = useState([]);
    // const [listNotFoundData, setListNotFoundData] = useState([]);
    const [dateLogFile, setDateLogFile] = useState(dayjs().format('YYYY-MM-DD'));
    const {msgError} = useCustomMessage()

    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        const {signal} = controller;

        const fetchData = async () => {
            try {
                const data = await fetchCronLogData('http://localhost:3000/api/logs/not-found/',dayjs().format('YYYY-MM-DD'), signal);
                setFileNotFoundData(data);
                // const listFile = await fetchCronLogData('http://localhost:3000/api/logs/not-found/', '', signal);
                // setListNotFoundData(listFile);
            }
            catch(err) {
                if (err.name !== 'AbortError') {
                    msgError(`Ошибка при загрузке not-found лога: ${err.message}`);
                }
            }
        };
    
        fetchData();

        return () => controller.abort();
    },[isOpen])

    // поиск файла логов по дате
    const handleSearchLogFile = async (value) => {
        setDateLogFile(value)
        try {
            const data = await fetchCronLogData('http://localhost:3000/api/logs/not-found/',value)
            setFileNotFoundData(data)
        }
        catch(err) {
            if (err.name !== 'AbortError') console.error(err);
            msgError(`Ошибка при загрузке not-found лога: ${err.message}`)
        }
    }

    function HeaderSearch() {
        return (
            <Flex justify="space-between" align="center" gap={20}>
                <Text style={{}}>Список на {dayjs(dateLogFile).format('DD.MM.YYYY')}</Text>
                <Search 
                    style={{flex:1}}
                    placeholder="Поиск файла логов по дате (гггг-мм-дд)..."
                    allowClear
                    onSearch={handleSearchLogFile}                    
                />
            </Flex>
        )
    }
    
    return (
        <Modal
            title={<Text>Список не выполненных задач</Text>}
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            width={1200}
            destroyOnHidden
            style={{overflow:'auto'}}
        >
            <List
                header={
                    <HeaderSearch/>
                }
                bordered
                dataSource={fileNotFoundData}
                renderItem={item => 
                    <List.Item>
                        <List.Item.Meta
                            avatar={<UserOutlined/>}
                            title={<Text>{item}</Text>}
                        />
                    </List.Item>
                }
                style={{maxHeight:'700px', overflow:'auto'}}
            />
        </Modal>
    )
})

export default FailedTaskModal;