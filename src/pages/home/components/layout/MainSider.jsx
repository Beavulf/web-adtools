/**
 * MainSider — компонент для сайдбара с поиском сотрудников и списком найденных пользователей.
 *
 * Используйте этот компонент внутри основного layout-страницы "Home".
 * Принимает все необходимые данные и коллбэки через пропсы.
 */
/**
 * @param {Object} props
 * @param {Function} props.handleSelectedCard - обработчик выбора пользователя
 * @param {Object} props.selectedUserCard - выделенная карточка пользователя
 * @param {Function} props.openNotification - функция для показа уведомлений
 */

import React, { useMemo, useCallback } from "react";
import { 
    Space, 
    Popover, 
    Input, 
    Empty, 
    Flex,
    Typography
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import UserListItem from "../user/UserListItem";
import { useLdap } from "../../../../hooks/api/useLdap";
import isActiveFormat from "../../../../utils/isActiveFormat";

const { Title } = Typography;
const { Search } = Input;

// Стилизованные компоненты вместо inline-стилей
const SiderContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const SearchHeader = styled(Space)`
    display: flex;
    padding: 20px;
    flex: 0 0 auto;
`;

const SearchTitle = styled(Title)`
    color: rgb(255, 255, 255) !important;
    margin: 0 !important;
`;

const UsersList = styled.div`
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
`;

const UserCardWrapper = styled.div`
    animation: fadeIn 0.3s ease-in;
    animation-delay: ${props => props.$delay}s;
    animation-fill-mode: both;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const EmptyContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85%;
`;

const EmptyWrapper = styled.div`
    opacity: ${props => props.$isLoading ? 0 : 1};
    transition: opacity 0.3s ease;
`;

// Константа для задержки анимации
const ANIMATION_DELAY_MULTIPLIER = 0.1;

function MainSider({
    handleSelectedCard = () => {},
    selectedUserCard = null,
    openNotification = () => {}
}) {
    const { actions, loading, ldapUsers } = useLdap({
        onError: (error) => {
            openNotification(`Ошибка при работе с LDAP: ${error}`, 'error');
        } 
    });

    // Мемоизация обработчика поиска для оптимизации
    const handleSearch = useCallback(async (value) => {
        if (!value?.trim()) {
            return;
        }
        await actions.search(value);
    }, [actions]);

    // Мемоизация обработчика клика по карточке
    const handleCardClick = useCallback((userInfo) => {
        handleSelectedCard(userInfo);
    }, [handleSelectedCard]);

    // Мемоизация списка пользователей для оптимизации рендеринга
    const usersList = useMemo(() => {
        if (!ldapUsers?.length) {
            return null;
        }

        return ldapUsers.map((userInfo, index) => (
            <UserCardWrapper
                key={userInfo.sAMAccountName}
                $delay={index * ANIMATION_DELAY_MULTIPLIER}
                className="user-card-wrapper"
                onClick={() => handleCardClick(userInfo)}
            >
                <UserListItem
                    isActive={userInfo.sAMAccountName === selectedUserCard?.sAMAccountName}
                    fio={userInfo.cn}
                    department={userInfo.department}
                    description={userInfo.description}
                    ribbonText={isActiveFormat(userInfo)}
                />
            </UserCardWrapper>
        ));
    }, [ldapUsers, selectedUserCard, handleCardClick]);

    return (
        <SiderContainer>
            <SearchHeader direction="vertical">
                <Flex align="center">
                    <Space direction="horizontal" size="small">
                        <Popover content="Поиск сотрудников в Active Directory">
                            <SearchOutlined onClick={() => openNotification('Вот это ты кликер конечно.','success')} className="main-icon"/>
                        </Popover>
                        <SearchTitle level={3}>
                            Поиск сотрудников
                        </SearchTitle>
                    </Space>
                </Flex>

                {/* Поле поиска сотрудников */}
                <Search
                    placeholder="Поиск по ФИО, логину..." 
                    allowClear
                    size="large"
                    loading={loading.search}
                    disabled={loading.search}
                    onSearch={handleSearch}
                />
            </SearchHeader>

            {/* Список найденных сотрудников */}
            <UsersList>
                {usersList ? (
                    usersList
                ) : (
                    <EmptyContainer>
                        <EmptyWrapper $isLoading={loading.search}>
                            <Empty style={{ fontSize: '28px' }} />
                        </EmptyWrapper>
                    </EmptyContainer>
                )}
            </UsersList>
        </SiderContainer>
    );
}

export default MainSider;