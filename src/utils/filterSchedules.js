/**
 * Фильтрует массив записей расписания по поисковому запросу
 * @param {Array} schedules - Массив записей расписания
 * @param {string} searchQuery - Поисковый запрос
 * @returns {Array} Отфильтрованный массив
 */
const filterSchedulesByQuery = (schedules, searchQuery) => {
    if (!Array.isArray(schedules)) return [];
    const trimmedQuery = searchQuery?.trim();
    if (!trimmedQuery) return schedules;

    // Регулярное выражение для поиска диапазона дат, например '12.12.2025-18.12.2025'
    const dateRangeRegex = /^(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})$/;
    const match = trimmedQuery.match(dateRangeRegex);

    // 1. Проверяем, является ли запрос диапазоном дат
    if (match) {
        const [, startStr, endStr] = match;

        // Вспомогательная функция для парсинга даты в формате DD.MM.YYYY
        const parseDate = (dateString) => {
            const parts = dateString.split('.');
            if (parts.length === 3) {
                // Год, месяц (0-индексированный), день
                const date = new Date(parts[2], parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                return isNaN(date.getTime()) ? null : date;
            }
            return null;
        };

        let searchStartDate = parseDate(startStr);
        let searchEndDate = parseDate(endStr);
        
        // Если пользователь ввел даты в обратном порядке, меняем их местами
        if (searchStartDate && searchEndDate && searchStartDate > searchEndDate) {
            [searchStartDate, searchEndDate] = [searchEndDate, searchStartDate];
        }

        if (searchStartDate && searchEndDate) {
            // Для инклюзивного диапазона устанавливаем время на начало и конец дня
            searchStartDate.setHours(0, 0, 0, 0);
            searchEndDate.setHours(23, 59, 59, 999);

            return schedules.filter(record => {
                const recordStartDate = new Date(record.startDate);
                const recordEndDate = new Date(record.endDate);

                if (isNaN(recordStartDate.getTime()) || isNaN(recordEndDate.getTime())) {
                    return false;
                }
                
                // Проверка на полное вхождение в диапазон:
                // Дата начала записи должна быть больше или равна дате начала поиска
                // И
                // Дата окончания записи должна быть меньше или равна дате окончания поиска.
                return recordStartDate >= searchStartDate && recordEndDate <= searchEndDate;
            });
        }
    }
    
    // 2. Если это не диапазон дат, используем исходную логику текстового поиска
    const searchLower = trimmedQuery.toLowerCase();
    const searchableFields = ['fio', 'login', 'order', 'createdAt', 'updatedAt', 'description', 'startDate', 'endDate'];
    const dateFields = ['startDate', 'endDate', 'createdAt', 'updatedAt'];
    
    // Функция нормализации даты
    const normalizeDate = (dateValue) => {
        if (!dateValue) return '';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return String(dateValue).toLowerCase();
            // Возвращаем дату в форматах DD.MM.YYYY и YYYY-MM-DD для универсального поиска
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}.${month}.${year} ${year}-${month}-${day}`;
        } catch {
            return String(dateValue).toLowerCase();
        }
    };
    
    return schedules.filter(record => {
        for (const field of searchableFields) {
            const value = record[field];
            if (!value) continue;
            
            // Для дат используем нормализованный формат
            if (dateFields.includes(field)) {
                if (normalizeDate(value).toLowerCase().includes(searchLower)) {
                    return true;
                }
            } else {
                // Для остальных полей обычный поиск
                if (String(value).toLowerCase().includes(searchLower)) {
                    return true;
                }
            }
        }
        return false;
    });
};

export default filterSchedulesByQuery;