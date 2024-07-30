import React from 'react';
import Chart from './Chart';
import DataTable from './DataTable';

const AnalysisResults = ({ data }) => {
    const chartConfigs = [
        { key: 'avgConsMake', title: "Average Consumption", type: 'line' },
        { key: 'co2ByClass', title: "CO2 Emissions by Vehicle Class", type: 'bar' },
        { key: 'fuelTypeDist', title: "Fuel Type Distribution", type: 'bar' },
        { key: 'bestSmog', title: "Best Smog Ratings", type: 'bar' },
        { key: 'consByTrans', title: "Consumption by Transmission", type: 'bar' },
        { key: 'co2RatingPct', title: "CO2 Rating Percentages", type: 'pie' },
        { key: 'topLowCo2', title: "Top Low CO2 Emitters", type: 'bar' },
        { key: 'topEfficient', title: "Top Efficient Vehicles", type: 'line' }
    ];

    // Function to format raw data based on chart type
    const formatChartData = (rawData, key) => {
        if (!rawData || rawData.length === 0) return [];
    
        const config = chartConfigs.find(c => c.key === key);
        if (!config) return [];
    
        // Map raw data to formatted data based on key
        const formattedData = rawData.map(item => {
            const labels = Object.keys(item);
            let labelIndex, valueIndex;
    
            switch (key) {
                case 'fuelTypeDist':
                case 'avgConsMake':
                case 'co2ByClass':
                case 'consByTrans':
                case 'topLowCo2':
                    labelIndex = 1;
                    valueIndex = 2;
                    break;
                case 'bestSmog':
                case 'topEfficient':
                    labelIndex = 2;
                    valueIndex = 3;
                    break;
                case 'co2RatingPct':
                    labelIndex = 1;
                    valueIndex = 3;
                    break;
                default:
                    return null;
            }
    
            return {
                label: item[labels[labelIndex]],
                value: parseFloat(item[labels[valueIndex]])
            };
        }).filter(Boolean); // Remove any null values
        
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
                        data={formatChartData(data[config.key], config.key)}
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
