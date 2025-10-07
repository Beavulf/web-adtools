import React, {useState, useCallback} from "react";
import { 
    Button,
    Flex,
    Modal,
} from "antd"
import { FileSearchOutlined, SearchOutlined, AppstoreAddOutlined, FileAddOutlined } from "@ant-design/icons";
import UserAddForm from "./forms/UserAddForm";
import UserOneTimeForm from "./forms/UserOneTimeForm";
import UserArchiveHistory from "./forms/UserArchiveHistory";
import './UserInfo.css'

const UserInfoAction = React.memo(({selectedUser, onTableSearch}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOneTimeOpen, setIsModalOneTimeOpen] = useState(false);
    const [isModalGetHistoryOpen, setIsModalGetHistoryOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const handleFindInSchedule = useCallback(() => {
        if (isSearchActive) {
            setIsSearchActive(false)
            onTableSearch('');
        }else if (selectedUser) {
            setIsSearchActive(true)
            // Ищем по логину пользователя в таблице
            onTableSearch(selectedUser.sAMAccountName);
        }
    }, [selectedUser, onTableSearch, isSearchActive]);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleModalOneTimeOpen = () => {
        setIsModalOneTimeOpen(true);
    }

    const handleModalOneTimeClose = useCallback(() => {
        setIsModalOneTimeOpen(false);
    }, []);

    const handleModalGetHistoryOpen = () => {
        setIsModalGetHistoryOpen(true);
    }

    const handleModalGetHistoryClose = useCallback(() => {
        setIsModalGetHistoryOpen(false);
    }, []);

    return (
        <Flex vertical gap={10} style={{flex:1, marginBottom:'11px', marginTop:'11px'}}>
            <Flex vertical flex={1} gap={10}>
                <Button 
                    className="action-main"
                    type="primary" 
                    block 
                    icon={<AppstoreAddOutlined/>} 
                    iconPosition="end" 
                    disabled={!selectedUser}
                    onClick={handleModalOpen}
                >Добавить в расписание</Button>
                <Button 
                    type="dashed" 
                    block 
                    icon={<FileAddOutlined/>} 
                    iconPosition="end" 
                    style={{flex:1}}
                    disabled={!selectedUser}
                    onClick={handleModalOneTimeOpen}
                >Добавить разовую задачу</Button>
            </Flex>
            <Flex gap={10} flex={0.5} >
                <Button 
                    disabled={!selectedUser} 
                    style={{height:'100%', whiteSpace:'normal'}} 
                    icon={<FileSearchOutlined/>} 
                    iconPosition="end" 
                    onClick={handleModalGetHistoryOpen}
                >
                    Просмотреть историю
                </Button>
                <Button 
                    disabled={!selectedUser} 
                    style={{
                        height:'100%', 
                        whiteSpace:'normal', 
                        transition:'all 0.3s ease-out',
                        backgroundColor:isSearchActive ? 'rgba(170, 210, 235, 0.17)' : '',
                    }} 
                    icon={<SearchOutlined/>} 
                    iconPosition="end"
                    onClick={handleFindInSchedule}
                >
                    Найти в расписании
                </Button>
            </Flex>

            {/* модальное окно добавления задачи */}
            <Modal
                title='Добавление новой задачи'
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                destroyOnHidden
            >
                <UserAddForm 
                    selectedUser={selectedUser}
                    handleModalClose={handleModalClose}
                />
            </Modal>

            {/* модальное окно добавления разовой задачи*/}
            <Modal
                title='Добавление разовой задачи'
                open={isModalOneTimeOpen}
                onCancel={handleModalOneTimeClose}
                footer={null}
                destroyOnHidden
            >
                <UserOneTimeForm 
                    selectedUser={selectedUser}
                    handleModalClose={handleModalOneTimeClose}
                />
            </Modal>

            {/* модальное окно просмотра истории задач*/}
            <Modal
                title='Просмотр истории задач из Архива'
                open={isModalGetHistoryOpen}
                onCancel={handleModalGetHistoryClose}
                footer={null}
                destroyOnHidden
                width={1500}
            >
                <UserArchiveHistory 
                    sAMAccountName={selectedUser?.sAMAccountName}
                    // handleModalClose={handleModalGetHistoryClose}
                />
            </Modal>
        </Flex>
    )
});
export default UserInfoAction;