// Данные для графика
const chartData = {
  'Выручка руб.': {
    'Текущий день': 125450,
    Вчера: 118230,
    'Этот день недели': 132100,
  },
  Наличные: {
    'Текущий день': 45200,
    Вчера: 42100,
    'Этот день недели': 48500,
  },
  'Безналичный расчёт': {
    'Текущий день': 80250,
    Вчера: 56130,
    'Этот день недели': 83600,
  },
  'Кредитные карты': {
    'Текущий день': 35100,
    Вчера: 32800,
    'Этот день недели': 38200,
  },
  'Средний чек руб': {
    'Текущий день': 1850,
    Вчера: 1720,
    'Этот день недели': 1920,
  },
  'Средний гость руб': {
    'Текущий день': 1420,
    Вчера: 10380,
    'Этот день недели': 1480,
  },
  'Удаление из чека (после оплаты), руб': {
    'Текущий день': 2300,
    Вчера: 1850,
    'Этот день недели': 2100,
  },
  'Количество чеков': {
    'Текущий день': 68,
    Вчера: 69,
    'Этот день недели': 100,
  },
  'Количество гостей': {
    'Текущий день': 3,
    Вчера: 86,
    'Этот день недели': 89,
  },
};

// Получаем элементы
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const chartTitle = document.getElementById('chart-title');
const tableRowsContainer = document.getElementById('table-rows-container');
let tableRows = [];

// Функция для заполнения строк таблицы из ChartData
function createTableRows() {
  tableRowsContainer.innerHTML = '';
  tableRows = [];

  Object.keys(chartData).forEach((indexName) => {
    const row = document.createElement('div');
    row.className = 'table-row';

    const data = chartData[indexName];

    row.innerHTML = `
      <div class="cell indicator-column">${indexName}</div>
      <div class="cell current-day-column">${data['Текущий день'].toLocaleString()}</div>
      <div class="cell yesterday-column">${data['Вчера'].toLocaleString()}</div>
      <div class="cell weekday-column">${data['Этот день недели'].toLocaleString()}</div>
    `;

    tableRowsContainer.appendChild(row);
    tableRows.push(row);
  });
}

// Функция для рисования графика
function drawChart(data, title) {
  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Обновляем заголовок
  chartTitle.textContent = `График: ${title}`;

  const categories = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values);

  // Настройки графика
  const margin = { top: 40, right: 40, bottom: 80, left: 80 };
  const chartWidth = 600;
  const chartHeight = 300;
  const chartX = margin.left;
  const chartY = margin.top;
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;

  // Рисуем фон
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(chartX, chartY, plotWidth, plotHeight);

  // Рисуем сетку
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;

  // Горизонтальные линии сетки
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = chartY + (plotHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + plotWidth, y);
    ctx.stroke();
  }

  // Вертикальные линии сетки
  for (let i = 0; i <= categories.length; i++) {
    const x = chartX + (plotWidth / categories.length) * i;
    ctx.beginPath();
    ctx.moveTo(x, chartY);
    ctx.lineTo(x, chartY + plotHeight);
    ctx.stroke();
  }

  // Рисуем основные оси
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  // Ось Y (вертикальная)
  ctx.beginPath();
  ctx.moveTo(chartX, chartY);
  ctx.lineTo(chartX, chartY + plotHeight);
  ctx.stroke();

  // Ось X (горизонтальная)
  ctx.beginPath();
  ctx.moveTo(chartX, chartY + plotHeight);
  ctx.lineTo(chartX + plotWidth, chartY + plotHeight);
  ctx.stroke();

  // Рисуем стрелки на осях
  // Стрелка оси Y
  ctx.beginPath();
  ctx.moveTo(chartX, chartY);
  ctx.lineTo(chartX - 5, chartY + 10);
  ctx.moveTo(chartX, chartY);
  ctx.lineTo(chartX + 5, chartY + 10);
  ctx.stroke();

  // Стрелка оси X
  ctx.beginPath();
  ctx.moveTo(chartX + plotWidth, chartY + plotHeight);
  ctx.lineTo(chartX + plotWidth - 10, chartY + plotHeight - 5);
  ctx.moveTo(chartX + plotWidth, chartY + plotHeight);
  ctx.lineTo(chartX + plotWidth - 10, chartY + plotHeight + 5);
  ctx.stroke();

  // Рисуем ломаную линию
  const colors = ['#1976d2', '#388e3c', '#388e3c'];
  const lineColor = '#1976d2';
  const pointColor = '#1976d2';
  const pointRadius = 6;

  // Вычисляем координаты точек
  const points = categories.map((category, index) => {
    const x = chartX + (plotWidth / (categories.length - 1)) * index;
    const y = chartY + plotHeight - (values[index] / maxValue) * plotHeight;
    return { x, y, value: values[index], category };
  });

  // Рисуем линию
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  // Рисуем точки
  points.forEach((point, index) => {
    // Внешний круг (белый)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius + 2, 0, 2 * Math.PI);
    ctx.fill();

    // Внутренний круг (цветной)
    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Обводка точки
    ctx.strokeStyle = pointColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Рисуем значение над точкой
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(point.value.toLocaleString(), point.x + 20, point.y - 15);

    // Рисуем подпись категории на оси X
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(point.category, point.x, chartY + plotHeight + 20);
  });

  // Рисуем подписи значений на оси Y
  ctx.fillStyle = '#666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'right';
  for (let i = 0; i <= gridLines; i++) {
    const value = Math.round((maxValue / gridLines) * (gridLines - i));
    const y = chartY + (plotHeight / gridLines) * i;
    ctx.fillText(value.toLocaleString(), chartX - 10, y + 4);
  }

  // Рисуем заголовки осей
  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Периоды', chartX + plotWidth / 2, chartY + plotHeight + 50);

  // Рисуем заголовок оси Y
  ctx.save();
  ctx.translate(chartX - 50, chartY + plotHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Значения', 0, 0);
  ctx.restore();

  // Рисуем легенду
  const legendX = chartX + plotWidth + 20;
  const legendY = chartY + 20;

  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'left';
  ctx.fillText('Показатель:', legendX, legendY);

  // Рисуем линию в легенде
  const legendLineY = legendY + 25;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(legendX, legendLineY);
  ctx.lineTo(legendX + 20, legendLineY);
  ctx.stroke();

  // Рисуем точку в легенде
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(legendX + 10, legendLineY, pointRadius + 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = pointColor;
  ctx.beginPath();
  ctx.arc(legendX + 10, legendLineY, pointRadius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = pointColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(legendX + 10, legendLineY, pointRadius, 0, 2 * Math.PI);
  ctx.stroke();

  // Текст легенды
  ctx.fillStyle = '#333';
  ctx.font = '11px Arial';
  ctx.fillText('Значение показателя', legendX + 30, legendLineY + 4);
}

// Функция для добавления обработчиков кликов на строки таблицы
function addRowEventListeners() {
  tableRows.forEach((row, index) => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', function () {
      // Убираем выделение с других строк
      tableRows.forEach((r) => r.classList.remove('selected'));
      // Выделяем текущую строку
      this.classList.add('selected');

      // Получаем название показателя
      const indicatorCell = this.querySelector('.indicator-column');
      const indicatorName = indicatorCell.textContent;

      // Рисуем график
      if (chartData[indicatorName]) {
        drawChart(chartData[indicatorName], indicatorName);
      }
    });
  });
}

// Инициализация: создаем таблицу и показываем график "Выручка руб." по умолчанию
function initializeDefaultChart() {
  createTableRows();
  addRowEventListeners();

  const firstRow = tableRows[0];
  if (firstRow) {
    firstRow.classList.add('selected');

    const defaultIndicator = 'Выручка руб.';
    if (chartData[defaultIndicator]) {
      drawChart(chartData[defaultIndicator], defaultIndicator);
    }
  }
}

// Запускаем инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', initializeDefaultChart);
