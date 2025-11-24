/**
 * Функция форматирования оставшегося времени по миллисекундам.
 * Используется для отображения "Время до следующего выполнения" в футере приложения и модальных окнах.
 * Пример: 10000000 → "0 д 2 ч 46 мин"
 *
 * @param {number|string} timeout - Оставшееся время в миллисекундах (может прийти числом или строкой).
 * @returns {string} - Строка в формате "X д Y ч Z мин" или "—" если передано некорректное значение.
 */

const timeLeft = (timeout) => {
    const raw = timeout;
    const ms = Number(String(raw).replace(/\s/g, ''));

    if (typeof ms !== "number" || isNaN(ms)) return "—";

    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

    let result = "";
    if (days > 0) result += `${days} д `;
    if (hours > 0 || days > 0) result += `${hours} ч `;
    result += `${minutes} мин`;

    return result.trim();
};

export default timeLeft;