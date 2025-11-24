/**
 * UserListItem — карточка пользователя для списка найденных сотрудников.
 * 
 * Показывает ФИО, отдел, описание и статус аккаунта.
 * Использует компоненты Ant Design (Card, Tag, Typography, Flex).
 * 
 * Пропсы:
 * - fio: строка — ФИО пользователя
 * - department: строка — отдел
 * - description: строка — описание
 * - ribbonText: строка — статус аккаунта ("ВКЛЮЧЕНА"/"ВЫКЛЮЧЕНА")
 * - isActive: boolean — выделена ли карточка
 */
import React from 'react';
import { 
  Card, 
  Tag,
  Typography,
  Flex
} from 'antd';
import { AuditOutlined, ReadOutlined } from '@ant-design/icons';

const {Title, Text} = Typography;

const UserListItem = React.memo(({fio, department, description, ribbonText, isActive}) => {
  return (
    <Card
      title={<Title level={4} ellipsis style={{margin:0}}>{fio}</Title>}
      className={`user-card-element ${isActive ? "selected" : ""}`}
      extra={
        <Tag bordered={false} color={ribbonText === 'ВКЛЮЧЕНА' ? 'green' : 'red'}>
          <h4>{ribbonText}</h4>
        </Tag>
      }
      styles={{ body: { padding:'10px 24px', overflow:'hidden', } }}
    >
      <Flex gap={10}>
        <Tag bordered={false} icon={<AuditOutlined />} color="purple">
          Отдел: {department}
        </Tag>
        <Flex>
          <Tag bordered={false} icon={<ReadOutlined />} color="magenta">
            Описание
          </Tag>
          <Text ellipsis style={{fontSize:'12px', maxWidth:'200px',color:'gray'}}>
            - {description ?? 'нет'}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
});
    
export default UserListItem;