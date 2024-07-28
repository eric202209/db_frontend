import React, { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Chart = ({ data = [], title, type }) => {
  if (!data || data.length === 0) {
    return <div>No data available for this chart.</div>;
  }

  const [selectedItem, setSelectedItem] = useState(null);

  const chartData = {
    labels: Array.isArray(data) ? data.map(item => item.make || item.vehClass || item.fuelType || item.trans || item.co2Rating || '') : [],
    datasets: [
      {
        label: title,
        data: Array.isArray(data) ? data.map(item => item.avgCons || item.combCons || item.count || item.avgCo2 || item.percentage || 0) : [],
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)'
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedItem(data[index]);
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  let ChartComponent;
  switch(type) {
    case 'fuelTypeDist':
    case 'co2RatingPct':
      ChartComponent = Pie;
      break;
    case 'consByTrans':
    case 'co2ByClass':
      ChartComponent = Line;
      break;
    default:
      ChartComponent = Bar;
  }

  return (    
    <div className="chart">
      <h2>{title}</h2>
      <ChartComponent data={chartData} options={chartOptions} />
      {selectedItem && (
        <div className="detail-view">
          <h3>{selectedItem.make || selectedItem.vehClass || selectedItem.fuelType || selectedItem.trans || selectedItem.co2Rating}</h3>          
          <p>Value: {selectedItem.avgCons || selectedItem.combCons || selectedItem.count || selectedItem.avgCo2 || selectedItem.percentage}</p>
        </div>
      )}
    </div>
  );
};

export default Chart;