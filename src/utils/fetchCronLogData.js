/**
 * Загружает данные из лог-файла cron-задач c сервера по указанному URL и дате.
 * Используется для получения списка не выполненных задач за выбранную дату.
 * Возвращает массив строк (каждая строка — отдельная запись из лога).
 * @param {string} url - Базовый URL для запроса лог-файла (например, 'http://localhost:3000/api/logs/not-found/')
 * @param {string} [date=''] - Дата, к которой запрашивается лог (в формате 'YYYY-MM-DD'). По умолчанию — пустая строка (без даты).
 * @param {AbortSignal} [signal] - (Необязательно) AbortSignal для отмены запроса, если компонент размонтирован.
 * @returns {Promise<Array>} Массив строк — содержимое лога по строкам.
 */

const fetchCronLogData = async (url, date='', signal) => {
    try {
        const response = await fetch(`${url}${date}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal
        });
    
        if (!response.ok) return [];
    
        const data = await response.json();
        
        if (!data) return [];

        // Если data - это строка с данными через перенос строки
        if (typeof data === 'string' || data.content) {
            const content = typeof data === 'string' ? data : data.content;
            
            // Разделяем по переносу строки и фильтруем пустые строки
            const lines = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
            
            return lines;
        } 

        if (data.files) return data.files;
    
        return [];
    } catch (err) {
        if (err.name !== "AbortError") console.error(err);
        return [];
    }
};

export default fetchCronLogData;