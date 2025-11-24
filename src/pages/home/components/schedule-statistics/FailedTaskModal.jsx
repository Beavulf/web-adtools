/**
 * FailedTaskModal.jsx
 * 
 * Модальное окно для отображения неудачных (не найденных) задач за выбранную дату.
 * Используется для просмотра задач, которые не были найдены при выполнении процессов (например, задачи по Active Directory).
 *
 * Компонент использует Ant Design для интерфейса, styled-components для стилизации, и отображает список ошибок за выбранную дату.
 * Данные подгружаются из серверного лога через fetchCronLogData.
 * 
 * Входные параметры:
 * - isOpen (boolean): состояние открытия модального окна.
 * - onCancel (function): функция закрытия модального окна.
 * 
 * @module FailedTaskModal
 */

import React, { useState, useEffect } from "react";
import {
    Modal,
    Typography,
    Flex,
    List,
    Input,
    Button,
    Popover
} from 'antd'
import dayjs from "dayjs";
import { UserOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useCustomMessage } from '../../../../context/MessageContext'
import fetchCronLogData from "../../../../utils/fetchCronLogData";
import styled from "styled-components";

const {Text} = Typography;
const {Search} = Input;
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const ClickableListItem = styled(List.Item)`
  &.clickable {
    cursor: pointer;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

const FailedTaskModal = React.memo(({isOpen, onCancel})=>{
    const [fileNotFoundData, setFileNotFoundData] = useState([]);
    const [dateLogFile, setDateLogFile] = useState(dayjs().format('YYYY-MM-DD'));
    const {msgError} = useCustomMessage()

    useEffect(() => {
        if (!isOpen) return;
        setDateLogFile(dayjs().format('YYYY-MM-DD'))
        const controller = new AbortController();
        const {signal} = controller;

        const fetchData = async () => {
            try {
                const data = await fetchCronLogData(`${SERVER_URL}api/logs/not-found/`,dayjs().format('YYYY-MM-DD'), signal);
                setFileNotFoundData(data);
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
    const handleSearchLogFile =  async (value) => {
        try {
            const data = await fetchCronLogData(`${SERVER_URL}api/logs/not-found/`,value)
            setFileNotFoundData(data)
        }
        catch(err) {
            if (err.name !== 'AbortError') console.error(err);
            msgError(`Ошибка при загрузке not-found лога: ${err.message}`)
        }
    };

    const handleClickFile = async (value) => {
        if (dateLogFile){
            return;
        }
        setDateLogFile(value);
        await handleSearchLogFile(value);
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
                    <Flex justify="space-between" align="center" gap={20}>
                        <Text>{dateLogFile ? `Список на ${dayjs(dateLogFile).format('DD.MM.YYYY')}` : 'Список файлов'}</Text>
                        <Search 
                            style={{flex:1}}
                            placeholder="Поиск файла логов по дате (гггг-мм-дд), пустой поиск - показать список файлов..."
                            allowClear
                            onSearch={handleSearchLogFile}   
                            value={dateLogFile}
                            onChange={e => setDateLogFile(e.target.value)}  
                        />
                        <Popover
                            content="Перейти к списку файлов"
                        >
                            <Button 
                                icon={<UnorderedListOutlined/>}
                                onClick={() => {
                                setDateLogFile('');
                                handleSearchLogFile();
                            }}>спис.</Button>
                        </Popover>
                    </Flex>
                }
                bordered
                dataSource={fileNotFoundData}
                renderItem={item => 
                    <ClickableListItem
                        className={!dateLogFile ? 'clickable' : ''}
                        onClick={() => handleClickFile(item)}
                    >
                        <List.Item.Meta
                            avatar={<UserOutlined/>}
                            title={<Text>{item}</Text>}
                        />
                    </ClickableListItem>
                }
                style={{maxHeight:'700px', overflow:'auto'}}
            />
        </Modal>
    )
})

export default FailedTaskModal;