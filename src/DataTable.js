import React from 'react';

const DataTable = ({ data }) => {
    if (!data || data.length === 0) return null;
  
    const headers = Object.keys(data[0]);
  
    return (
      <table className="data-table">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header.replace(/_/g, ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

export default DataTable;