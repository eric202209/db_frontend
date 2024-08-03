import React from 'react';
import { Table } from 'react-bootstrap';

const ComparisonView = ({ items }) => {
  if (items.length === 0) return null;

  const comparisonFields = [
    'engine_size', 'cylinders', 'transmission', 'fuel_type', 'city_consumption',
    'highway_consumption', 'combined_consumption', 'combined_mpg', 'co2_emissions',
    'co2_rating', 'smog_rating'
  ];

  return (
    <div className="comparison-view">
      <h2>Vehicle Comparison</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Attribute</th>
            {items.map((item, index) => (
              <th key={index}>{`${item.model_year} ${item.make} ${item.model}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonFields.map(field => (
            <tr key={field}>
              <td>{field.replace('_', ' ').toUpperCase()}</td>
              {items.map((item, index) => (
                <td key={index}>{item[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ComparisonView;