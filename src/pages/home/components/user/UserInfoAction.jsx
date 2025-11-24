/**
 * UserInfoAction — панель действий для выбранного пользователя.
 * 
 * Содержит кнопки для:
 * - Добавления пользователя
 * - Добавления разовой задачи
 * - Просмотра архивной истории задач пользователя
 * - Поиска задач пользователя в расписании
 * 
 * Также отображает триггеры статистики по задачам (выполненные, проваленные, все разовые).
 *
 * @component
 * @param {Object} props
 * @param {Object} props.selectedUser - Текущий выбранный пользователь (объект пользователя или null)
 * @param {Function} props.onTableSearch - Функция для поиска задачи пользователя в таблице расписания по sAMAccountName
 *
 * Компонент адаптирован под Ant Design Flex, поддерживает адаптивную верстку.
 */
import React, {useState, useCallback} from "react";
import { 
    Button,
    Flex,
    Divider,
} from "antd";
import { 
    SearchOutlined, 
} from "@ant-design/icons";
import FailedStatisticsTrigger from "../schedule-statistics/FailedStatisticsTrigger";
import CompletedStatisticsTrigger from "../schedule-statistics/CompletedStatisticsTrigger";
import AllOneTimeTrigger from "./forms/onetime/AllOneTimeTrigger";
import UserAddModal from "./forms/UserAddModal";
import UserOneTimeModal from "./forms/UserOneTimeModal";
import UserArchiveHistoryTrigger from "./forms/UserArchiveHistoryTrigger";
import './UserInfo.css'

const UserInfoAction = React.memo(({selectedUser, onTableSearch}) => {
    const [isSearchActive, setIsSearchActive] = useState(false);

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

    return (
        <Flex style={{flex:1, marginBottom:'11px', marginTop:'11px'}}>
            <Flex vertical gap={10}>
                <Flex vertical flex={1} gap={10}>
                    <UserAddModal selectedUser={selectedUser}/>
                    <UserOneTimeModal selectedUser={selectedUser}/>
                </Flex>
                <Flex gap={10} flex={0.46} >
                    <UserArchiveHistoryTrigger selectedUser={selectedUser}/>
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
            {/* боковой блок с кнопками статистики*/}
            <Flex vertical gap={10} style={{width:'50px'}} justify="center">
                <AllOneTimeTrigger/>
                <CompletedStatisticsTrigger/>
                <FailedStatisticsTrigger/>
            </Flex>

        </Flex>
    )
});
export default UserInfoAction;