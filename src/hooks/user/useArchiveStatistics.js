import { useMemo } from 'react';

/**
 * Хук для расчета статистики по архивным записям расписания
 * @param {Array} archiveSchedules - Массив архивных записей расписания
 * @returns {Object} Объект со статистикой по каждому типу записи
 * 
 * @example
 * const stats = useArchiveStatistics(data?.getArchiveSchedules);
 * // stats.OTPYSK.totalCount, stats.OTPYSK.totalDays
 */
const useArchiveStatistics = (archiveSchedules) => {
    return useMemo(() => {
        // Если данных нет - возвращаем пустой объект
        if (!Array.isArray(archiveSchedules) || archiveSchedules.length === 0) {
            return {
                OTPYSK: { totalCount: 0, totalDays: 0 },
                STAJIROVKA: { totalCount: 0, totalDays: 0 },
                DEKRET: { totalCount: 0, totalDays: 0 },
                UCHEBA: { totalCount: 0, totalDays: 0 },
                PRODLENIE_OTPYSKA: { totalCount: 0, totalDays: 0 },
                KOMANDIROVKA: { totalCount: 0, totalDays: 0 }
            };
        }
        
        // Инициализируем объект для всех типов
        const byType = {
            OTPYSK: { totalCount: 0, totalDays: 0 },
            STAJIROVKA: { totalCount: 0, totalDays: 0 },
            DEKRET: { totalCount: 0, totalDays: 0 },
            UCHEBA: { totalCount: 0, totalDays: 0 },
            PRODLENIE_OTPYSKA: { totalCount: 0, totalDays: 0 },
            KOMANDIROVKA: { totalCount: 0, totalDays: 0 }
        };
        
        // Один проход по массиву - собираем статистику
        archiveSchedules.forEach(record => {
            const type = record.type;
            if (byType[type]) {
                byType[type].totalCount += 1;
                
                // Корректный расчет дней (включая последний день)
                const start = new Date(record.startDate);
                const end = new Date(record.endDate);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                
                byType[type].totalDays += days;
            }
        });
        
        return byType;
    }, [archiveSchedules]);
};

export default useArchiveStatistics;