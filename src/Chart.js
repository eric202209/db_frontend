import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const getColors = (count) => {
  const colors = [
    'rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)', 'rgba(255,206,86,0.6)',
    'rgba(54,162,235,0.6)', 'rgba(153,102,255,0.6)', 'rgba(255,159,64,0.6)'
  ];
  return Array(count).fill().map((_, i) => colors[i % colors.length]);
};

const Chart = ({ data, type, title }) => {
  console.log(`Rendering chart for ${title}:`, data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available for this chart.</div>;
  }

  // // Sort data for 'Top Low CO2 Vehicles' chart
  // const sortedData = title === 'Top Low CO2 Vehicles' 
  // ? [...data].sort((a, b) => a.value - b.value).slice(0, 10)
  // : data;

  const labels = data.map(item => item.label || 'Undefined');
  const values = data.map(item => {
    const value = parseFloat(item.value);
    return isNaN(value) ? 0 : value;
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: type === 'pie' ? getColors(values.length) : getColors(1)[0],
        borderColor: type === 'line' ? getColors(1)[0] : 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: { 
        display: true, 
        text: title,
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            let value;
            if (type === 'pie') {
              value = context.parsed;
            } else {
              value = context.parsed.y;
            }
            if (value !== null && !isNaN(value)) {
              value = parseFloat(value);
              if (title === 'CO2 Rating Percentages') {
                label += value.toFixed(2) + '%';
              } else if (title === 'Top Low CO2 Vehicles' || title === 'CO2 Emissions by Vehicle Class') {
                label += value.toFixed(2) + ' g/km';
              } else if (title === 'Consumption by Transmission' || title.includes('Consumption')) {
                label += value.toFixed(2) + ' L/100km';
              } else {
                label += value.toFixed(2);
              }
            } else {
              label += 'N/A';
            }
            return label;
          }
        }
      }
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true,
        ticks: {
          font:{size:12},
          callback: function(value) {
            if (value === null || isNaN(value)) return 'N/A';
            value = parseFloat(value);
            if (title === 'CO2 Rating Percentages') {
              return value.toFixed(2) + '%';
            } else if (title === 'Top Low CO2 Vehicles' || title === 'CO2 Emissions by Vehicle Class') {
              return value.toFixed(2) + ' g/km';
            } else if (title === 'Consumption by Transmission' || title.includes('Consumption')) {
              return value.toFixed(2) + ' L/100km';
            } else {
              return value.toFixed(2);
            }
          }
        },
        grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
    } : {},
  };

  const renderChart = () => {
    try {
      switch (type) {
        case 'bar':
          return <Bar data={chartData} options={options} />;
        case 'line':
          return <Line data={chartData} options={options} />;
        case 'pie':
          return <Pie data={chartData} options={options} />;
        default:
          return <Bar data={chartData} options={options} />;
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return <div>Error rendering chart. Check console for details.</div>;
    }
  };

  return (
    <div className="chart-container">
      {renderChart()}
    </div>
  );
};

export default Chart;
