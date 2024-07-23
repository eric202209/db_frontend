import React from 'react';

const DataTable = ({ data = [], title, onComparisonToggle }) => {
    return (
        <div className="datatable">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Combined Consumption</th>
                        <th>CO2 Emissions</th>
                        <th>Compare</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.map((vehicle, index) => (
                    <tr key={index}>
                        <td>{vehicle.make || ''}</td>
                        <td>{vehicle.model || ''}</td>
                        <td>{vehicle.combined_consumption || ''}</td>
                        <td>{vehicle.co2_emissions || ''}</td>
                        <td>
                            <input 
                                type="checkbox" 
                                onChange={() => onComparisonToggle(vehicle)} 
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;