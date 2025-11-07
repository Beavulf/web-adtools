/**
 * Фильтрует массив записей расписания по поисковому запросу
 * @param {Array} schedules - Массив записей расписания
 * @param {string} searchQuery - Поисковый запрос
 * @returns {Array} Отфильтрованный массив
 */
const filterSchedulesByQuery = (schedules, searchQuery) => {
    if (!Array.isArray(schedules)) return [];
    if (!searchQuery?.trim()) return schedules;
    
    const searchLower = searchQuery.toLowerCase().trim();
    const searchableFields = ['fio', 'login', 'order', 'createdAt', 'updatedAt', 'description', 'startDate', 'endDate'];
    const dateFields = ['startDate', 'endDate', 'createdAt', 'updatedAt'];
    
    // Функция нормализации даты
    const normalizeDate = (dateValue) => {
        if (!dateValue) return '';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return String(dateValue);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`.toLowerCase();
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
                if (normalizeDate(value).includes(searchLower)) {
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