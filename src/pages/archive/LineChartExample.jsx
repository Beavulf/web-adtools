import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { Card, Button } from 'antd'; // Импортируем Card из Ant Design для обрамления графика
import { useSchedule } from '../../hooks/api/useSchedule';

/**
 * @component LineChartExample
 * @description Пример простого линейного графика с использованием Ant Design Charts.
 * Показывает динамику значений по годам.
 */
const LineChartExample = () => {
  const { actions, fetchArchiveSchedulesData, loading } = useSchedule({
    onError: (error) => {
      console.log(`Ошибка при работе с расписанием: ${error}`, 'error');
    }
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Данные могут приходить в виде { schedules: { items: [...] } } или как простой массив.
    // Убедимся, что fetchArchiveSchedulesData является массивом и не пуст
    if (Array.isArray(fetchArchiveSchedulesData) && fetchArchiveSchedulesData.length > 0) {
      const items = fetchArchiveSchedulesData;
      // Фильтруем только записи с типом "OTPYSK" (отпуск)
      const vacationData = items.filter(item => item.type === 'OTPYSK');

      // Считаем количество отпусков по кварталам
      const quarterlyCounts = vacationData.reduce((acc, item) => {
        const date = new Date(item.startDate);
        // Проверяем, что дата корректна
        if (!isNaN(date.getTime())) {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          acc[quarter] = (acc[quarter] || 0) + 1;
        }
        return acc;
      }, {});

      // Форматируем данные для графика, чтобы были все 4 квартала
      const formattedData = [
        { quarter: '1 квартал', value: quarterlyCounts[1] || 0 },
        { quarter: '2 квартал', value: quarterlyCounts[2] || 0 },
        { quarter: '3 квартал', value: quarterlyCounts[3] || 0 },
        { quarter: '4 квартал', value: quarterlyCounts[4] || 0 },
      ];

      setChartData(formattedData);
    } else {
      // Если данных нет или они не в формате массива, сбрасываем данные графика
      setChartData([]);
    }
  }, [fetchArchiveSchedulesData]);

  // Конфигурация графика.
  // Конфигурация графика для Ant Design Charts (Line)
  // Структура и пропсы соответствуют документации https://charts.ant.design/zh/examples/line/basic/
  const config = {
    data: chartData,          // Массив данных для графика
    xField: 'quarter',        // Название поля для оси X (категории кварталов)
    yField: 'value',          // Название поля для оси Y (значения для каждого квартала)
    smooth: true,             // Сглаженные линии графика
    point: {                  // Настройки точек на линии
      size: 5,
      shape: 'diamond',
    },
    label: {                  // Отображать подписи к точкам
      position: 'top',        // Положение метки — сверху над точкой
      // Смещаем метку немного вверх, чтобы она не касалась точки
      offsetY: -10,
      style: {
        fill: '#aaa',         // Цвет текста подписи
        fontWeight: 600,
      },
    },
    tooltip: {
      // Форматтер для всплывающей подсказки.
      // Заголовок (title) будет взят из поля xField (квартал).
      formatter: (datum) => {
        return { name: 'Сотрудников в отпуске', value: `${datum.value} чел.` };
      },
    },
    xAxis: {
      title: {
        text: 'Квартал',
        style: { color: '#888' }
      },
      // tickLine: null,         // Не отображать лишние линии
    },
    yAxis: {
      title: {
        text: 'Количество сотрудников в отпуске',
        style: { color: '#888' }
      },
      min: 0,                 // Нижняя граница по Y — всегда 0
      tickInterval: 1,        // Для небольших чисел шаг по 1
    },
    height: 500,              // Фиксируем высоту графика, чтобы не "прыгал"
    animation: true,          // Включаем анимацию появления
  };

  return (
    
    // Оборачиваем график в компонент Card от Ant Design для лучшей визуализации
    <Card title="Количество сотрудников в отпуске по кварталам">
      <Button 
        loading={loading.fetchArchiveSchedules}
        onClick={() => actions.fetchArchiveSchedules({ variables: { filter: {} } })}
      >GET
    </Button>
      {/* Рендерим компонент Line с нашей конфигурацией */}
      <Line {...config} />
    </Card>
  );
};

export default LineChartExample;