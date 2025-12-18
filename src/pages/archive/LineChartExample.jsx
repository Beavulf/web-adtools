import React from 'react';
import { Line } from '@ant-design/charts';
import { Card } from 'antd'; // Импортируем Card из Ant Design для обрамления графика

/**
 * @component LineChartExample
 * @description Пример простого линейного графика с использованием Ant Design Charts.
 * Показывает динамику значений по годам.
 */
const LineChartExample = () => {
  // Данные для графика.
  // Обычно эти данные приходят с сервера (например, через GraphQL запрос).
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  // Конфигурация графика.
  // Здесь мы определяем, какие поля из `data` используются для осей X и Y,
  // а также можно настроить внешний вид графика (точки, линии, подписи и т.д.).
  const config = {
    data,              // Передаем наши данные
    xField: 'year',    // Поле для оси X
    yField: 'value',   // Поле для оси Y
    seriesField: 'year', // Используем 'year' для разделения серий, если нужны разные цвета для каждого года
    point: {           // Настройки для точек на графике
      size: 5,
      shape: 'diamond', // Форма точек (например, 'circle', 'square', 'diamond')
      style: {
        fill: '#34a853', // Цвет заливки точек
        stroke: '#fff',  // Цвет обводки точек
        lineWidth: 2,
      },
    },
    label: {           // Настройки для текстовых меток над точками
      style: {
        fill: '#aaa',
      },
    },
    tooltip: {         // Настройки для всплывающей подсказки при наведении
      formatter: (datum) => ({ name: 'Значение', value: `${datum.value} ед.` }),
    },
    xAxis: {           // Настройки для оси X
      title: {
        text: 'Год',
      },
    },
    yAxis: {           // Настройки для оси Y
      title: {
        text: 'Показатель',
      },
    },
    smooth: true,      // Делает линию графика сглаженной
    color: '#1890ff',  // Цвет линии графика по умолчанию
  };

  return (
    // Оборачиваем график в компонент Card от Ant Design для лучшей визуализации
    <Card title="Пример линейного графика">
      {/* Рендерим компонент Line с нашей конфигурацией */}
      <Line {...config} />
    </Card>
  );
};

export default LineChartExample;