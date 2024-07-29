import React from 'react';
import Chart from './Chart';

const AnalysisResults = ({ data }) => {
    const chartTitles = {
        avgConsMake: "Average Consumption by Make",
        co2ByClass: "CO2 Emissions by Vehicle Class",
        fuelTypeDist: "Fuel Type Distribution",
        bestSmog: "Best Smog Ratings",
        consByTrans: "Consumption by Transmission",
        co2RatingPct: "CO2 Rating Percentages",
        topLowCo2: "Top Low CO2 Emitters"
    };

    return (
        <div className="analysis-results">
            <h2>Analysis Results</h2>
            {Object.entries(chartTitles).map(([key, title]) => (
                <Chart key={key} data={data[key]} title={title} type={key} />
            ))}
        </div>
    );
};

export default AnalysisResults;