/**
 * TriggerOpenModalRecall компонент отвечает за отображение кнопки для открытия модального окна создания отзыва сотрудника.
 * Используется в таблице расписания, чтобы инициировать процесс отзыва пользователя (например, отправка в отпуск/командировку).
 * Включает кнопку с подсказкой (Popover), открывающую RecallModal.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.record - объект записи (schedule), для которой возможен отзыв
 * @param {function} props.msgWarning - функция вывода предупреждающего сообщения
 *
 * Пример использования:
 * <TriggerOpenModalRecall record={someScheduleRecord} msgWarning={showWarningMessage} />
 */
import React,{ useState, useCallback } from "react";
import {
    Flex,
    Button,
    Popover,
} from 'antd'
import { HistoryOutlined } from "@ant-design/icons";
import RecallModal from "./RecallModal";

const TriggerOpenModalRecall = React.memo(({record, msgWarning}) => {
    const [open, setOpen] = useState(false);
    
    const handleModalRecall = () => {
        if (record.isRecall) {
            msgWarning('Запись уже отозвана.')
            return;
        }
        setOpen(true);
    };

    const handleCloseModal = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <Flex>
            <Popover content={<span>Отозвать сотрудника</span>}>
                <Button 
                    size="middle"
                    icon={<HistoryOutlined />} 
                    style={{color:'green'}}
                    onClick={handleModalRecall}
                />
            </Popover>
            <RecallModal isOpen={open} onCancel={handleCloseModal} record={record}/>
        </Flex>
    )
});
export default TriggerOpenModalRecall;