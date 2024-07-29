import React from 'react';

const ComparisonView = ({ items }) => {
    if (items.length === 0) return null;

    const headers = Object.keys(items[0]).filter(key => key !== 'id');

    return (
        <div className="comparison-view">
            <h2>Vehicle Comparison</h2>
            <table>
                <thead>
                    <tr>
                        <th>Attribute</th>
                        {items.map((item, index) => (
                            <th key={index}>{`Vehicle ${index + 1}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {headers.map(header => (
                        <tr key={header}>
                            <td>{header}</td>
                            {items.map((item, index) => (
                                <td key={index}>{item[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonView;