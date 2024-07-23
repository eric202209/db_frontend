import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, LinearScale } from 'chart.js';
ChartJS.register(LinearScale, ArcElement);
import Chart from './Chart';
import DataTable from './DataTable';
import FilterPanel from './FilterPanel';
import ComparisonView from './ComparisonView';

const Dashboard = () => {
    const [data, setData] = useState({
        avgConsMake: [],
        topEfficient: [],
        fuelTypeDist: [],
        co2ByClass: [],
        bestSmog: [],
        consByTrans: [],
        co2RatingPct: [],
        topLowCo2: []
    });
    const [filter, setFilter] = useState({});
    const [selectedChart, setSelectedChart] = useState('avgConsMake');
    const [comparisonItems, setComparisonItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/data', { params: filter });
            console.log('Fetched data:', response.data); // Log response data
            
            // Parse the response data
            const parsedData = {
                avgConsMake: response.data.avgConsMake.map(item => ({ make: item.MAKE, avgCons: item.AVG_CONS })),
                topEfficient: response.data.topEfficient.map(item => ({ make: item.MAKE, model: item.MODEL, combCons: item.COMB_CONS })),
                fuelTypeDist: response.data.fuelTypeDist.map(item => ({ fuelType: item.FUEL_TYPE, count: item.COUNT_FT })),
                co2ByClass: response.data.co2ByClass.map(item => ({ vehClass: item.VEH_CLASS, avgCo2: item.AVG_CO2 })),
                bestSmog: response.data.bestSmog.map(item => ({ make: item.MAKE, model: item.MODEL, smogRating: item.SMOG_RATING })),
                consByTrans: response.data.consByTrans.map(item => ({ trans: item.TRANS, avgCons: item.AVG_CONS })),
                co2RatingPct: response.data.co2RatingPct.map(item => ({ co2Rating: item.CO2_RATING, count: item.COUNT_CR, percentage: item.PERCENTAGE })),
                topLowCo2: response.data.topLowCo2.map(item => ({ make: item.MAKE, avgCo2: item.AVG_CO2 }))
            };
            
            // setData(response.data);
            setData(parsedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const chartTitles = {
        avgConsMake: "Average Consumption by Make",
        co2ByClass: "CO2 Emissions by Vehicle Class",
        fuelTypeDist: "Fuel Type Distribution",
        bestSmog: "Best Smog Ratings",
        consByTrans: "Consumption by Transmission",
        co2RatingPct: "CO2 Rating Percentages",
        topLowCo2: "Top Low CO2 Emitters"
    };

    const handleComparisonToggle = (item) => {
        setComparisonItems(prevItems => 
            prevItems.includes(item)
                ? prevItems.filter(i => i !== item)
                : [...prevItems, item]
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <FilterPanel onFilterChange={setFilter} />
            <select onChange={(e) => setSelectedChart(e.target.value)}>
                {Object.entries(chartTitles).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
            {data[selectedChart] && data[selectedChart].length > 0 ? (
                <Chart data={data[selectedChart]} title={chartTitles[selectedChart]} type={selectedChart} />
            ) : (
                <div>No data available for the selected chart.</div>
            )}
            <div className="top-efficient">
                <h2>Top Efficient Vehicles</h2>
                {data.topEfficient && data.topEfficient.length > 0 ? (
                    <DataTable
                        data={data.topEfficient}
                        onComparisonToggle={handleComparisonToggle}
                    />
                ) : (
                    <p className="no-data-message">No data available for top efficient vehicles.</p>
                )}
            </div>
            {comparisonItems.length > 0 && <ComparisonView items={comparisonItems} />}
        </div>
    );
};

export default Dashboard;