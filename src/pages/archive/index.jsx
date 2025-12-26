/**
 * ArchivePage
 * Страница для отображения архивных данных в нескольких таблицах с вкладками.
 * - Использует Ant Design для структуры (Layout, Card, Tabs).
 * - Повторяет стиль и структуру HomePage для консистентности.
 * - Отображает три таблицы: архив задач, архив отзывов, архив разовых задач.
 * - Данные для таблиц пока используются моковые (заглушки).
 */
import React, { useState, useEffect } from 'react';
import { 
    Layout, 
    Card, 
    Flex, 
    Typography, 
    Menu, 
    notification, 
    Divider, 
    Input, 
    Button,
    DatePicker,
    Table,
    Checkbox,
    Tag,
    Tooltip,
    Drawer
} from 'antd';
import FilterComponent from './FilterComponent';
import styled, { keyframes } from 'styled-components';
import { useAuth } from "../../context/AuthContext";
import FooterInfo from "../home/components/layout/FooterInfo";
import MainHeader from "../home/components/layout/MainHeader";
import { useLdap } from "../../hooks/api/useLdap";
import { 
    ScheduleOutlined, 
    CommentOutlined, 
    FileDoneOutlined, 
    LineChartOutlined,
    SyncOutlined,
    BgColorsOutlined,
    FilterOutlined
} from '@ant-design/icons';
import LineChartExample from './LineChartExample';
import scheduleArchiveColumns from './columns/ScheduleArchiveColumns';
import recallColumns from './columns/RecallArchiveColumns';
import oneTimesArchiveColumns from './columns/OneTimesArchiveColumns';
import { useSchedule } from '../../hooks/api/useSchedule';
import { useRecall } from '../../hooks/api/useRecall';
import { useOneTime } from '../../hooks/api/useOneTime';

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;

const StyledTable = styled(Table)`
  .ant-table-tbody > tr:nth-child(odd) {
    background: ${({ isColored }) => isColored ? "#fff" : "inherit"};
  }
  .ant-table-tbody > tr:nth-child(even) {
    background: ${({ isColored }) => isColored ? "rgba(127, 162, 219, 0.09)" : "inherit"};
  }
`;

// Анимация появления
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Стилизованный компонент для анимации
const AnimatedContentWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease-in-out;
`;
// Элементы меню для боковой панели
const menuItems = [
    { key: '1', icon: <ScheduleOutlined />, label: 'Расписание' },
    { key: '2', icon: <CommentOutlined />, label: 'Отзывы' },
    { key: '3', icon: <FileDoneOutlined />, label: 'Разовые задачи' },
    { key: '4', icon: <LineChartOutlined />, label: 'График' },
];

const custimPageSizeOptions = ['13','26','50']

const ArchivePage = () => {
    const { logout: logoutClient } = useAuth(); 
    const [selectedKey, setSelectedKey] = useState('1');
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(custimPageSizeOptions[0]);
    const [isTableColored, setIsTableColored] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { actions } = useLdap({
        onError: (error) => {
            openNotification(`Ошибка при работе с LDAP: ${error}`, 'error');
        }
    });
    const {actions: actionsSchedule, loading: loadingSchedule, fetchArchiveSchedulesData} = useSchedule({
        onError: (error) => {
            openNotification(`Ошибка при работе с расписанием: ${error}`, 'error');
        }
    });
    const {actions: actionsRecall, loading: loadingRecall, fetchArchiveRecallsData} = useRecall({
        onError: (error) => {
            openNotification(`Ошибка при работе с отзывами: ${error}`, 'error');
        }
    });
    const {actions: actionsOneTime, loading: loadingOneTime, fetchArchiveOneTimesData} = useOneTime({
        onError: (error) => {
            openNotification(`Ошибка при работе с разовыми задачами: ${error}`, 'error');
        }
    });

    useEffect(()=>{
        actionsSchedule.fetchArchiveSchedules({variables:{filter:{},take:50}});
        actionsRecall.fetchArchiveRecalls({variables:{filter:{},take:50}});
        actionsOneTime.fetchArchiveOneTimes({variables:{filter:{},take:50}});
    }, [])

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (text,type) => {
        api.open({
            message: 'Оповещение',
            description: text,
            showProgress: true,
            pauseOnHover: true,
            placement: 'bottom',
            type
        });
    }

    const handleLogout = async () => {
        try {
            await actions.logout();
        } catch (err) {
            openNotification(`Ошибка при выходе: ${err}`, 'error');
        } finally {
            logoutClient();
        }
    };

    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        document.title = "Архив - Web AD-Tools";
        return () => {
            clearTimeout(timer);
            document.title = "-- Web AD-Tools --";
        };
    }, []);

    const getDataSourceByKey = (key) => {
        switch (key) {
            case '1':
                return fetchArchiveSchedulesData || [];
            case '2':
                return fetchArchiveRecallsData || [];
            case '3':
                return fetchArchiveOneTimesData || [];
            default:
                return [];
        }
    }

    const syncDataFromDBByKey = (key) => {
        switch (key) {
            case '1':
                return actionsSchedule.fetchArchiveSchedules({variables:{filter:{},take:50}});
            case '2':
                return actionsRecall.fetchArchiveRecalls({variables:{filter:{},take:50}});
            case '3':
                return actionsOneTime.fetchArchiveOneTimes({variables:{filter:{},take:50}});
            default:
                return [];
        }
        
    }

    const getColumnsByKey = (key) => {
        switch (key) {
            case '1':
                return scheduleArchiveColumns;
            case '2':
                return recallColumns;
            case '3':
                return oneTimesArchiveColumns;
            default:
                return [];
        }
    }

    const getLoadingStatusByKey = (key) => {
        switch (key) {
            case '1':
                return loadingSchedule.fetchArchiveSchedules;
            case '2':
                return loadingRecall.fetchArchiveRecalls;
            case '3':
                return loadingOneTime.fetchArchiveOneTimes;
            default:
                return false;
        }
    }

    const submitFilter = (values) => {
        if (selectedKey==='1') {
            
            actionsSchedule.fetchArchiveSchedules({variables:{filter:values}});
        } else if (selectedKey==='2') {
            actionsRecall.fetchArchiveRecalls({variables:{filter:values}});
        } else if (selectedKey==='3') {
            actionsOneTime.fetchArchiveOneTimes({variables:{filter:values}});
        } else {
            alert('Выберите таблицу для фильтрации');
        }
    }

    const resetFilter = () => {
        if (selectedKey==='1') {
            actionsSchedule.fetchArchiveSchedules({variables:{filter:{}}});
        } else if (selectedKey==='2') {
            actionsRecall.fetchArchiveRecalls({variables:{filter:{}}});
        }
        else if (selectedKey==='3') {
            actionsOneTime.fetchArchiveOneTimes({variables:{filter:{}}});
        } else {
            alert('Выберите таблицу для фильтрации');
        }
    }
    
    const renderContent = (key) => {
        const selectedLabel = menuItems.find(item => item.key === key)?.label || '';
        return (    
            <AnimatedContentWrapper key={key}>
                <Flex vertical>
                    {key === '4' ? <LineChartExample/> :
                        <Flex vertical flex={1}>
                            <Flex align='center' gap={10} style={{margin:10}}>
                                <Title level={4}>Архив (последние 50 записей): {selectedLabel}</Title>
                                <Tooltip title="Записей в таблице">
                                    <Tag color={'blue'}>{getDataSourceByKey(key).length}</Tag>
                                </Tooltip>
                                <Flex style={{marginLeft:'auto'}} gap={10}>
                                    <Button icon={<BgColorsOutlined/>} onClick={()=>setIsTableColored(!isTableColored)}>
                                        <Checkbox checked={isTableColored} onChange={(e) => setIsTableColored(e.target.checked)}/>
                                    </Button>
                                    <Button 
                                        icon={<SyncOutlined />} 
                                        onClick={()=>syncDataFromDBByKey(key)}
                                        disabled={getLoadingStatusByKey(key)}
                                        >обновить
                                    </Button>
                                </Flex>
                            </Flex>
                            <StyledTable
                                isColored={isTableColored}
                                pagination={{
                                    current,
                                    pageSize,
                                    pageSizeOptions: custimPageSizeOptions,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    onChange: (page, size) => {
                                      setCurrent(page);
                                      setPageSize(size);
                                    }
                                  }}
                                dataSource={getDataSourceByKey(key)}
                                columns={getColumnsByKey(key)}
                                size="middle"
                                rowKey={"id"}
                                loading={getLoadingStatusByKey(key)}
                                scroll={{ y: 615 }}
                            />
                        </Flex>
                    }
                </Flex>
            </AnimatedContentWrapper>
        );
    };

    return (
        <Layout
            style={{
                height: '100%',
                background: 'linear-gradient(135deg,#91dce9 0%, #9992ed 50%, #a98ec4 100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.4s ease-out',
                overflow: 'hidden'
            }}
        >
            <Header className="main-header-block">
                <MainHeader handleLogout={handleLogout} />
            </Header>

            <Content
                className="main-block"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'transform 0.3s ease-out',
                    display: 'flex',
                    flexDirection: 'column',
                    margin:5,
                    minHeight: 0
                }}
            >
                {contextHolder}
                <Card style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', padding: 0, minHeight:0 }}>
                    <Layout style={{ height: '100%', background: 'transparent', minHeight:0 }}>
                        <Sider 
                            width={250} 
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.6)', 
                                borderRadius: '8px 0 0 8px', 
                                backdropFilter: 'blur(5px)', 
                                height: '100%', 
                                overflowY: 'auto', 
                                overflowX: 'hidden', 
                                paddingRight:'24px' 
                            }}>
                            <Title level={5} style={{ padding: '0 14px', color: 'gray' }}>Таблицы архива</Title>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                items={menuItems}
                                onSelect={({ key }) => setSelectedKey(key)}
                                style={{ background: 'transparent', border: 'none' }}
                            />
                            <Divider style={{color:'gray', margin:0}}>Фильтрация</Divider>
                            <FilterComponent onChange={submitFilter} onReset={resetFilter} selectedKey={selectedKey}/>
                        </Sider>
                        <Content style={{ minHeight: 0, background: 'rgba(255, 255, 255, 0.8)', borderRadius: '0 8px 8px 0', backdropFilter: 'blur(5px)' }}>
                            {renderContent(selectedKey)}
                            <Drawer
                                open={isFilterOpen}
                                onClose={() => setIsFilterOpen(false)}
                                placement="left"
                                width={420}
                                title="Фильтры"
                                // destroyOnHidden
                                mask
                                styles={{body:{padding:'5px 10px'}}}
                            >
                                <FilterComponent />
                            </Drawer>
                        </Content>
                    </Layout>
                </Card>
            </Content>

            <Footer className="main-footer-block" style={{margin:5}}>
                <FooterInfo notification={openNotification} />
            </Footer>
        </Layout>
    );
};

export default ArchivePage;