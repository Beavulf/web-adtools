import React, { useState, useEffect } from 'react';
import { Typography, Tooltip } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Ключ для хранения JWT токена в localStorage. Измените его, если у вас другой.
const TOKEN_KEY = 'token';

/**
 * Парсит JWT токен и возвращает его payload.
 * @param {string} token - JWT токен.
 * @returns {Object|null}
 */
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // atob() может вызывать ошибку, если строка некорректна
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

/**
 * Форматирует оставшееся время в строку ЧЧ:ММ:СС.
 * @param {number} ms - время в миллисекундах.
 * @returns {string}
 */
const formatTime = (ms) => {
    if (ms <= 0) {
        return '00:00:00';
    }
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

/**
 * Компонент таймера обратного отсчета сессии.
 * @param {Object} props
 * @param {Function} props.onSessionEnd - Колбэк, вызываемый при истечении сессии.
 */
const SessionTimer = ({ onSessionEnd }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        let expirationTime = 0;

        if (token) {
            const decodedToken = parseJwt(token);
            // `exp` - это стандартное поле для времени истечения в JWT (в секундах)
            if (decodedToken && decodedToken.exp) {
                expirationTime = decodedToken.exp * 1000; // Конвертируем в миллисекунды
            }
        }

        // Если токена нет или он уже истек, сразу завершаем сессию
        if (expirationTime <= Date.now()) {
            if (onSessionEnd) onSessionEnd();
            return;
        }

        const calculateTimeLeft = () => {
            return Math.max(0, expirationTime - Date.now());
        };

        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(intervalId);
                if (onSessionEnd) {
                    onSessionEnd();
                }
            }
        }, 1000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [onSessionEnd]);

    // Если времени не осталось, не рендерим компонент
    if (timeLeft <= 0) {
        return null;
    }

    // Цвет меняется на красный за 5 минут до конца сессии
    const timeColor = timeLeft < 5 * 60 * 1000 ? 'orange' : '';

    return (
        <Tooltip title="Время до окончания сессии">
            <div className='main-icon' style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', width:'150px', backgroundColor: timeColor }}>
                <ClockCircleOutlined />
                <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {formatTime(timeLeft)}
                </Text>
            </div>
        </Tooltip>
    );
};

export default SessionTimer;
