import React, {useState, useEffect} from "react";
import {
    Modal,
    Typography,
    Flex,
    Button,
    List,
    Dropdown,
    Space,
    Input
} from 'antd'
import dayjs from "dayjs";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import {useCustomMessage} from '../../../../context/MessageContext'

const {Text} = Typography;
const {Search} = Input;

const FailedTaskModal = React.memo(({isOpen, onCancel, countRecords})=>{
    const [fileNotFoundData, setFileNotFoundData] = useState([]);
    const [listNotFoundData, setListNotFoundData] = useState([]);
    const [dateLogFile, setDateLogFile] = useState(dayjs().format('YYYY-MM-DD'));

    const {msgWarning, msgError} = useCustomMessage()
    const fetchCronLog = async (url,date='') => {
        try {
            const response = await fetch(`${url}${date}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        
            if (!response.ok) {
                msgWarning(`Файл логов на сегодня еще не создан.`);
                return []
            }
        
            const data = await response.json();
            
            if (!data) {
                return []
            }
            // Если data - это строка с данными через перенос строки
            if (typeof data === 'string' || data.content) {
                const content = typeof data === 'string' ? data : data.content;
                
                // Разделяем по переносу строки и фильтруем пустые строки
                const lines = content
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                
                return lines;
            } 
            if (data.files) { 
                return data.files;                
            }
        
            return [];
        } catch (error) {
            msgError(`Ошибка при загрузке not-found лога: ${error.message}`);
            throw error;
        }
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const fetchData = async () => {
            const data = await fetchCronLog('http://localhost:3000/api/logs/not-found/',dayjs().format('YYYY-MM-DD'));
            setFileNotFoundData(data);
            const listFile = await fetchCronLog('http://localhost:3000/api/logs/not-found/');
            setListNotFoundData(listFile);
        };
    
        fetchData();
    },[isOpen])

    useEffect(()=>{
        const fetchCount = async () => {
            const count = await fetchCronLog('http://localhost:3000/api/logs/not-found/',dayjs().format('YYYY-MM-DD'))
            countRecords(count.length)
        }
        fetchCount()
    },[])

    const handleSearchLogFile = async (value) => {
        setDateLogFile(value)
        const data = await fetchCronLog('http://localhost:3000/api/logs/not-found/',value)
        setFileNotFoundData(data)
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