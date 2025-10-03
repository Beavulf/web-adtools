import React, {} from 'react'
import { 
    Flex,
    Tag,
    Typography,
    Popover
} from "antd"
import "./UserInfo.css"

const {Text, Paragraph} = Typography

const InfoBlock = ({selectedUser, text, title, iconSrc, helpText="-"}) => {
    return (
        <div className='block-info'>
            <img src={iconSrc} alt="ICO" style={{width:'56px', objectFit:'contain'}}/>
            <Flex vertical gap={6} style={{flexShrink:0}} className={selectedUser ? "text-fade-in" : ''}>
                <Popover 
                    trigger={'click'} 
                    content={<Paragraph copyable={selectedUser ? true : false} style={{maxWidth:'400px'}}>{text}</Paragraph>}
                >
                <Tag color="purple" style={{alignSelf:'flex-start'}}>{title}</Tag>
                <Text  className='block-info-text-more'>
                    <span className={selectedUser ? "text-fade-in" : ''}>{text}</span> 
                </Text>
                </Popover>
            </Flex>
            <Popover trigger={'hover'} content={helpText}>
                <a href="#" style={{margin:'5px 5px auto auto'}}>?</a>
            </Popover>
        </div>
    )
}

export default InfoBlock