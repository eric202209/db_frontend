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

const Chart = ({ data, type, title }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available for this chart.</div>;
  }

  // Ensure data has the expected structure
  if (!data[0].hasOwnProperty('label') || !data[0].hasOwnProperty('value')) {
    console.error('Invalid data format for chart:', data);
    return <div>Error: Invalid data format for chart.</div>;
  }
  
  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  const getColors = (count) => {
    const colors = [
      'rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)', 'rgba(255,206,86,0.6)',
      'rgba(54,162,235,0.6)', 'rgba(153,102,255,0.6)', 'rgba(255,159,64,0.6)'
    ];
    return Array(count).fill().map((_, i) => colors[i % colors.length]);
  };

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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y || context.parsed}`,
        },
      },
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true,
      },
    } : {},
  };

  const renderChart = () => {
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
  };

  return (
    <div className="chart-container">
      {renderChart()}
    </div>
  );
};

export default Chart;