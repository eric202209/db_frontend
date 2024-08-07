import React from 'react';
import { Table } from 'react-bootstrap';

const ComparisonView = ({ items }) => {
  if (!items || items.length === 0) return <p>No items selected for comparison.</p>;

  // Log the items to inspect their structure
  console.log('Comparison items:', items);

  // Dynamically get all keys from the first item
  const allKeys = Object.keys(items[0] || {});

  return (
    <div className="comparison-view">
      <h2>Vehicle Comparison</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Attribute</th>
            {items.map((item, index) => (
              <th key={index}>
                {`${item.MODEL_YEAR || item.model_year || 'Unknown Year'} 
                  ${item.MAKE || item.make || 'Unknown Make'} 
                  ${item.MODEL || item.model || 'Unknown Model'}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allKeys.map(key => (
            <tr key={key}>
              <td>{key.replace(/_/g, ' ')}</td>
              {items.map((item, index) => (
                <td key={index}>{item[key] != null ? item[key].toString() : 'N/A'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ComparisonView;
