import React from 'react';

const ComparisonView = ({ items }) => {
    return (
        <div className="comparison-view">
            <h2>Comparison</h2>
            {items.map((item, index) => (
                <div key={index}>
                    {/* Display comparison item details */}
                    <p>{item.make} {item.model}: {item.combined_consumption}</p>
                </div>
            ))}
        </div>
    );
};

export default ComparisonView;