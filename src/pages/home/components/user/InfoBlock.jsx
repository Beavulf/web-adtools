/**
 * Блок информации пользователя со всплывающими подсказками.
 * 
 * Показывает иконку, заголовок, основной текст и иконку помощи с подсказкой.
 * Клик по заголовку открывает popover с возможностью копирования текста.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.selectedUser - выбранный пользователь (для анимации и copyable)
 * @param {string} props.text - основной текст для блока (можно копировать)
 * @param {string} props.title - заголовок информации
 * @param {string} props.iconSrc - ссылка на иконку слева
 * @param {string} [props.helpText="-"] - текст подсказки, показываемый при наведении "?"
 */
import React from 'react'
import { 
    Flex,
    Tag,
    Typography,
    Popover,
    Button
} from "antd"
import "./UserInfo.css"

const {Text, Paragraph} = Typography

const InfoBlock = React.memo(({selectedUser, text, title, iconSrc, helpText="-"}) => {
    const content = <Paragraph copyable={!!selectedUser} style={{maxWidth:'400px'}}>{text}</Paragraph>
    return (
        <div className='block-info'>
            <img src={iconSrc} alt="ICO" style={{width:'56px', objectFit:'contain'}}/>
            <Flex vertical gap={6} style={{flexShrink:0}} className={selectedUser ? "text-fade-in" : ''}>
                <Tag color="purple" style={{alignSelf:'flex-start'}}>{title}</Tag>
                <Popover 
                    trigger={'click'} 
                    content={content}
                >
                    <Text className='block-info-text-more'>
                        <span className={selectedUser ? "text-fade-in" : ''}>{text}</span> 
                    </Text>
                </Popover>
            </Flex>
            <Popover trigger={'hover'} content={helpText}>
                <Button size='small' style={{margin:'5px 5px auto auto'}}>?</Button>
            </Popover>
        </div>
    )
});

export default InfoBlock