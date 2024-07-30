import React from 'react';
import Chart from './Chart';
import DataTable from './DataTable';

const AnalysisResults = ({ data }) => {
    const chartConfigs = [
        { key: 'avgConsMake', title: "Avg Consumption by Make Year", type: 'line' },
        { key: 'co2ByClass', title: "CO2 Emissions by Vehicle Class", type: 'bar' },
        { key: 'fuelTypeDist', title: "Fuel Type Distribution", type: 'pie' },
        { key: 'bestSmog', title: "Best Smog Ratings", type: 'bar' },
        { key: 'consByTrans', title: "Consumption by Transmission", type: 'bar' },
        { key: 'co2RatingPct', title: "CO2 Rating Percentages", type: 'pie' },
        { key: 'topLowCo2', title: "Top Low CO2 Emitters", type: 'bar' },
        { key: 'topEfficient', title: "Top Efficient Vehicles", type: 'bar' }
    ];

    const formatChartData = (rawData) => {
        if (!rawData || rawData.length === 0) return [];
        
        let formattedData = rawData.map(item => ({
            label: item[Object.keys(item)[0]],
            value: parseFloat(item[Object.keys(item)[1]])
        }));

        // Sort data from low to high
        formattedData.sort((a, b) => a.value - b.value);

        return formattedData;
    };

    return (
        <div className="analysis-results">
            <h2>Analysis Results</h2>
            {chartConfigs.map(config => (
                <div key={config.key} className="chart-section">
                    <h3>{config.title}</h3>
                    <Chart 
                        data={formatChartData(data[config.key])}
                        type={config.type}
                        title={config.title}
                    />
                    <DataTable data={data[config.key]} />
                </div>
            ))}
        </div>
    );
};

export default AnalysisResults;