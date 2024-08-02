import React from 'react';

const DataTable = ({ data, onComparisonToggle }) => {
    if (!data || data.length === 0) {
        return <p className="no-data-message">No data available.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                        <th>Compare</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {headers.map(header => (
                                <td key={header}>{row[header]}</td>
                            ))}
                            <td>
                                <button onClick={() => onComparisonToggle(row)}>
                                    Compare
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;