import Chart from 'chart.js/auto';

let barChart;
fetch('/Assignment Data 2025.xlsx - Task 1 (a).csv')
  .then((response) => response.text())
  .then((csv) => {
  const rows = csv.trim().split('\n');

  const dataRows = rows.slice(1).map(row => {
    const cols = row.split(',');
    return {
      Product: cols[0],
      TotalValue: parseFloat(cols[1]),
      TotalSales: parseFloat(cols[2]),
    };
  });
  const sortedData = dataRows.sort((a, b) => b.TotalSales - a.TotalSales);
  renderChart(sortedData);
})


function renderChart(data) {
  const products = data.map(row => row.Product);
  const totalValues = data.map(row => row.TotalValue);
  const totalSales = data.map(row => row.TotalSales);

  const minValue = Math.min(...totalValues);
  const maxValue = Math.max(...totalValues);

  const backgroundColors = totalValues.map(value => {
    const ratio = (value - minValue) / (maxValue - minValue);
    const red = 120 + ratio * 135;
    const green = 60 + ratio * 60;
    const blue = 40 + ratio * 60;
    return `rgb(${Math.floor(red)}, ${Math.floor(green)}, ${Math.floor(blue)})`;
  });

  const ctx = document.getElementById('barChart').getContext('2d');

  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: products,
      datasets: [{
        label: 'Total Sales',
        data: totalSales,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const index = tooltipItem.dataIndex;
              return [
                `Product: ${products[index]}`,
                `TotalSales=${totalSales[index]}`,
                `TotalValue=${totalValues[index]}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Product',
            font: { size: 14 }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Sales',
            font: { size: 14 }
          }
        }
      }
    }
  });

  addColorLegend(minValue, maxValue);
}

function addColorLegend(min, max) {
  const legendContainer = document.getElementById('colorLegend');
  legendContainer.innerHTML = '<h3>Total Value</h3>';

  const gradientBar = document.createElement('div');
  gradientBar.className = 'legend-gradient';

  const labels = document.createElement('div');
  labels.className = 'legend-labels';
  labels.innerHTML = `<span>${min}</span><span>${((min + max) / 2).toFixed(1)}</span><span>${max}</span>`;

  legendContainer.appendChild(gradientBar);
  legendContainer.appendChild(labels);
}
