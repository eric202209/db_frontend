import React from 'react';

const ComparisonView = ({ items }) => {
    return (
        <div className="comparison-view">
        <h2>Comparison</h2>
        <table>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Fuel Consumption</th>
              <th>CO2 Emissions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.make}</td>
                <td>{item.model}</td>
                <td>{item.fuelConsumption}</td>
                <td>{item.co2Emissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default ComparisonView;