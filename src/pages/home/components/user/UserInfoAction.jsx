import React, {useState, useCallback} from "react";
import { 
    Button,
    Flex,
    Modal,
    Popover,
    Typography,
    Divider,
    Badge
} from "antd"
import { 
    FileSearchOutlined,
    SearchOutlined, 
    AppstoreAddOutlined, 
    FileAddOutlined, 
    ProfileOutlined,
    FileDoneOutlined,
    FileExclamationOutlined
 } from "@ant-design/icons";
import UserAddForm from "./forms/UserAddForm";
import UserOneTimeForm from "./forms/UserOneTimeForm";
import UserArchiveHistory from "./forms/UserArchiveHistory";
import AllOneTimeModal from "./forms/onetime/AllOneTimeModal";
import FailedTaskModal from "../schedule-statistics/FailedTaskModal";
import './UserInfo.css'

const {Text} = Typography;

const UserInfoAction = React.memo(({selectedUser, onTableSearch}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOneTimeOpen, setIsModalOneTimeOpen] = useState(false);
    const [isModalGetHistoryOpen, setIsModalGetHistoryOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isModalAllOneTimeOpen, setIsModalAllOneTimeOpen] = useState(false);

    // поиск задачи в расписании по лоигну
    const handleFindInSchedule = useCallback(() => {
        if (isSearchActive) {
            setIsSearchActive(false)
            onTableSearch('');
        }else if (selectedUser) {
            setIsSearchActive(true)
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

    const handleModalAllOneTimeOpen = () => {
        setIsModalAllOneTimeOpen(true);
    }

    const handleModalAllOneTimeClose = useCallback(() => {
        setIsModalAllOneTimeOpen(false);
    }, []);

    function FailedStatisticsTrigger() {
        const [open, setOpen] = React.useState(false);
        const [countRecordsBadge, setCountRecordsBadge] = useState(0)
        return (
            <Flex style={{height:'100%', flex:0.2}}>
                <Badge size="small" count={countRecordsBadge}>
                <Popover content={<Text>Просмотреть список задач которые не выполнились</Text>}>
                        <Button 
                            icon={<FileExclamationOutlined />} 
                            onClick={()=>setOpen(true)}
                        ></Button>
                </Popover>
                </Badge>

                <FailedTaskModal countRecords={setCountRecordsBadge} isOpen={open} onCancel={()=>setOpen(false)} />
            </Flex>
        );
    }

    return (
        <Flex  style={{flex:1, marginBottom:'11px', marginTop:'11px'}}>
            <Flex vertical gap={10}>
                <Flex vertical flex={1} gap={10}>
                    <Button 
                        className="action-main"
                        type="primary" 
                        block 
                        icon={<AppstoreAddOutlined/>} 
                        iconPosition="end" 
                        disabled={!selectedUser}
                        onClick={handleModalOpen}
                        title="Добавить новую задачу в расписание на выбранного сотрудника"
                    >Добавить в расписание</Button>
                    <Flex flex={1} gap={10}>
                        <Button 
                            type="dashed" 
                            icon={<FileAddOutlined/>} 
                            iconPosition="end" 
                            style={{height:'100%', flex:1, whiteSpace:'normal'}}
                            disabled={!selectedUser}
                            onClick={handleModalOneTimeOpen}
                            title="Добавить разовую задачу на выбранного сотрудника"
                        >Добавить разовую задачу</Button>
                        
                    </Flex>
                </Flex>
                <Flex gap={10} flex={0.5} >
                    <Button 
                        disabled={!selectedUser} 
                        style={{height:'100%', whiteSpace:'normal'}} 
                        icon={<FileSearchOutlined/>} 
                        iconPosition="end" 
                        onClick={handleModalGetHistoryOpen}
                        title="Просмотр архивной истории задач выбранного сотрудника"
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
                        title="Найти активную задачу выбранного сотрудника в расписании (по логину)"
                    >
                        Найти в расписании
                    </Button>
                </Flex>
            </Flex>
            <Divider type="vertical" style={{height:'100%'}}/>
            <Flex vertical gap={10} style={{width:'50px'}} justify="center">
                <Popover content={<Text>Просмотреть список разовых задач</Text>}>
                    <Button 
                        icon={<ProfileOutlined/>} 
                        style={{height:'100%', flex:0.2}}
                        onClick={handleModalAllOneTimeOpen}
                    ></Button>
                </Popover>
                <Popover content={<Text>Просмотреть список задач выполненных сегодня</Text>}>
                    <Button 
                        icon={<FileDoneOutlined  />} 
                        style={{height:'100%', flex:0.2}}
                        // onClick={handleModalAllOneTimeOpen}
                    ></Button>
                </Popover>
                <FailedStatisticsTrigger/>
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
            <UserArchiveHistory 
                sAMAccountName={selectedUser?.sAMAccountName}
                isOpen={isModalGetHistoryOpen}
                onCancel={handleModalGetHistoryClose}
            />

            <AllOneTimeModal 
                onOpen={isModalAllOneTimeOpen} 
                onCancel={handleModalAllOneTimeClose}
                selectedUser={selectedUser}
            />
        </Flex>
    )
});
export default UserInfoAction;