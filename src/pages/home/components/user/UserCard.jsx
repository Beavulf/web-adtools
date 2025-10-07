import React from 'react';
import { Card, Tag } from 'antd';
import { AuditOutlined, ReadOutlined } from '@ant-design/icons';

const UserCard = React.memo(({fio, department, description, ribbonText, isActive}) => {
  return (
    <Card
      title={<h3>{fio}</h3>}
      variant="borderless"
      className={`user-card-element ${isActive ? "selected" : ""}`}
      style={{opacity:1}}
      extra={
        <Tag bordered={true} color={ribbonText === 'ВКЛЮЧЕНА' ? 'green' : 'red'}>
          <h4>{ribbonText}</h4>
        </Tag>
      }
      styles={{ body: { padding:'10px 24px' } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px',  }}>
        <Tag bordered={false} icon={<AuditOutlined />} color="purple">
          Отдел: {department}
        </Tag>
        <div style={{ display: 'flex', color: 'gray', overflow:'hidden', wordWrap:'break-word'}}>
          <Tag bordered={false} icon={<ReadOutlined />} color="magenta">
            Описание
          </Tag> {description}
        </div>
      </div>
    </Card>
  );
});
    
export default UserCard;