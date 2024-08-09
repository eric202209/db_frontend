import React from 'react';
import { Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const ComparisonView = ({ items }) => {
  if (!items || items.length === 0) return <p>No items selected for comparison.</p>;

  const compareFields = [
    'MODEL_YEAR',
    'MAKE',
    'MODEL',
    'VEHICLE_CLASS',
    'ENGINE_SIZE',
    'CYLINDERS',
    'TRANSMISSION',
    'FUEL_TYPE',
    'COMBINED_CONSUMPTION',
    'COMBINED_MPG',
    'CO2_EMISSIONS',
    'SMOG_RATING'
  ];

  const chartData = {
    labels: items.map(item => `${item.MAKE} ${item.MODEL}`),
    datasets: [
      {
        label: 'Combined Consumption (L/100km)',
        data: items.map(item => item.COMBINED_CONSUMPTION),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'CO2 Emissions (g/km)',
        data: items.map(item => item.CO2_EMISSIONS),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="comparison-view">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Attribute</th>
            {items.map((item, index) => (
              <th key={index}>{`${item.MAKE} ${item.MODEL}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareFields.map(field => (
            <tr key={field}>
              <td>{field.replace(/_/g, ' ')}</td>
              {items.map((item, index) => (
                <td key={index}>{item[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Consumption and Emissions Comparison</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ComparisonView;
