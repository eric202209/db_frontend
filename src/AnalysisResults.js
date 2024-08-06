import React from 'react';
import Chart from './Chart';
import DataTable from './DataTable';

const AnalysisResults = ({ data, comparisonData }) => {
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

    const formatChartData = (rawData, key, isComparison) => {
        if (!rawData || rawData.length === 0) return [];
    
        const config = chartConfigs.find(c => c.key === key);
        if (!config) return [];
    
        if (isComparison) {
            switch (key) {
                case 'avgConsMake':
                    return rawData.map(item => ({
                        label: `${item.MAKE} ${item.MODEL}`,
                        value: item.COMBINED_CONSUMPTION
                    }));
                case 'co2ByClass':
                    return rawData.map(item => ({
                        label: `${item.MAKE} ${item.MODEL}`,
                        value: item.CO2_EMISSIONS
                    }));
                case 'fuelTypeDist':
                    return rawData.map(item => ({
                        label: item.FUEL_TYPE,
                        value: 1 // Count of each fuel type
                    }));
                case 'bestSmog':
                    return rawData.map(item => ({
                        label: `${item.MAKE} ${item.MODEL}`,
                        value: item.SMOG_RATING
                    }));
                case 'consByTrans':
                    return rawData.map(item => ({
                        label: item.TRANSMISSION,
                        value: item.COMBINED_CONSUMPTION
                    }));
                case 'co2RatingPct':
                    return rawData.map(item => ({
                        label: `CO2 Rating ${item.CO2_RATING}`,
                        value: 1 // Count of each CO2 rating
                    }));
                case 'topLowCo2':
                    return rawData.map(item => ({
                        label: `${item.MAKE} ${item.MODEL}`,
                        value: item.CO2_EMISSIONS
                    }));
                case 'topEfficient':
                    return rawData.map(item => ({
                        label: `${item.MAKE} ${item.MODEL}`,
                        value: item.COMBINED_MPG
                    }));
                default:
                    return rawData.map(item => ({
                        label: `${item.MAKE} ${item.MODEL}`,
                        value: item[key.toUpperCase()]
                    }));
            }
        } else {
            // Existing logic for overall analysis data
            return rawData.map(item => {
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
            }).filter(Boolean);
        }
    };

    if (!data || Object.keys(data).length === 0) {
        return <div>No data available for analysis.</div>;
    }

    // Check if comparisonData is defined and an array
    const isComparisonDataAvailable = comparisonData && Array.isArray(comparisonData) && comparisonData.length > 0;

    // console.log('Data:', data);
    // console.log('Comparison Data:', comparisonData);

    return (
        <div className="analysis-results">
            <h2>{isComparisonDataAvailable ? "Vehicle Comparison" : "Analysis Results"}</h2>
            {chartConfigs.map(config => {
                const chartData = isComparisonDataAvailable
                    ? formatChartData(comparisonData, config.key, true)
                    : formatChartData(data[config.key], config.key, false);

                // console.log(`Chart Config for ${config.key}:`, chartData);

                if (chartData.length === 0) {
                    return <div key={config.key}>No data available for {config.title}</div>;
                }

                return (
                    <div key={config.key} className="chart-section">
                        <h3>{config.title}</h3>
                        <Chart
                            data={chartData}
                            type={config.type}
                            title={config.title}
                        />
                        <DataTable data={chartData} />
                    </div>
                );
            })}
        </div>
    );
};

export default AnalysisResults;

