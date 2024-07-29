import React, { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Title, Tooltip, Legend);

const Chart = ({ data = [], title, type }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    if (!data || data.length === 0) {
        return <div>No data available for this chart.</div>;
    }

    console.log('Chart data:', data);

    const chartData = {
      labels: data.map(item => item.MAKE || item.VEHICLE_CLASS || item.FUEL_TYPE || item.TRANSMISSION || item.CO2_RATING || ''),
      datasets: [
        {
          label: title,
          data: data.map(item => item.AVG_CONS || item.COMB_CONS || item.COUNT || item.AVG_CO2 || item.PERCENTAGE || 0),
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)'
        }
      ]
    };
    console.log('Processed chart data:', chartData);

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
        case 'topEfficient':
            ChartComponent = Pie;
            break;
        case 'consByTrans':
        case 'co2ByClass':
        case 'avgConsMake':
        case 'bestSmog':
        case 'topLowCo2':
            ChartComponent = Line;
            break;
        default:
            ChartComponent = Bar;
    }
    
    return (
        <div className="chart">
          {type === 'bar' && <Bar data={chartData} />}
          {type === 'line' && <Line data={chartData} />}
          {type === 'pie' && <Pie data={chartData} />}
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