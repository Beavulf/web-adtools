import React, {useState, useEffect} from "react";
import {
    Modal,
    Typography,
    Flex,
    Button,
    List,
    Dropdown,
    Space
} from 'antd'
import dayjs from "dayjs";
import { UserOutlined, DownOutlined } from "@ant-design/icons";


const {Text} = Typography;

const FailedTaskModal = React.memo(({isOpen, onCancel})=>{
    const [fileNotFoundData, setFileNotFoundData] = useState(null);
    const [listNotFoundData, setListNotFoundData] = useState([]);
    // const [dropDownItems, setDropDownItems] = useState([]);

    const fetchCronLog = async (url,date='') => {
        try {
            const response = await fetch(`${url}${date}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
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
        
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке not-found лога:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCronLog('http://localhost:3000/api/logs/not-found/',new dayjs().format('YYYY-MM-DD'));
                setFileNotFoundData(data);
                const listFile = await fetchCronLog('http://localhost:3000/api/logs/not-found/');
                setListNotFoundData(listFile);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
    
        fetchData();
    },[isOpen])

    const handleMenuClick = (e) => {
        console.log('click', e);
    };

    // useEffect(()=>{
    //     const dropdownItems = listNotFoundData?.files?.map((str, idx) => ({
    //         label: str,
    //         key: String(idx),
    //     }));
    //     console.log(dropdownItems);
        
    //     setDropDownItems(dropdownItems);
    // },[listNotFoundData])
    const dropdownItems = listNotFoundData?.files?.map((str, idx) => ({
        label: str,
        key: String(idx),
    }));
    const menuProps = {
        items: dropdownItems,
        onClick: handleMenuClick,
    };
    return (
        <Modal
            title={<Text>Список не выполненных задач</Text>}
            open={isOpen}
            onCancel={onCancel}
            footer={null}
            width={1200}
            destroyOnHidden
        >
            <List
                header={
                    <Flex justify="space-between" align="center">
                        <Text>Список на {new dayjs().format('DD.MM.YYYY')}</Text>
                        <Dropdown menu={menuProps}>
                            <Button>
                                <Space>
                                    Все даты
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Flex>
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
            />
        </Modal>
    )
})

export default FailedTaskModal;