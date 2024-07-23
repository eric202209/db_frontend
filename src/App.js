import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LinearScale } from 'chart.js';
ChartJS.register(LinearScale);
import Chart from './Chart'; 
import Dashboard from './Dashboard';
import DataTable from './DataTable';
import FilterPanel from './FilterPanel';
import ComparisonView from './ComparisonView';
import './App.css';
import axios from 'axios';

const App = () => {
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
    const [loading, setLoading] = useState(true); // Add loading state
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
            setData(response.data);
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
        topLowCo2: "Top Low CO2 Emitters",
    };

    const handleComparisonToggle = (item) => {
        setComparisonItems(prevItems => 
            prevItems.includes(item)
                ? prevItems.filter(i => i !== item)
                : [...prevItems, item]
        );
    };

    // return (
    //     <div className="app">
    //         <h1>Fuel Consumption Dashboard</h1>
    //         <Dashboard />
    //     </div>
    // );
    return (
        <div className="app">
            <h1>Fuel Consumption Dashboard</h1>
            <FilterPanel onFilterChange={setFilter} />
            <select onChange={(e) => setSelectedChart(e.target.value)}>
                {Object.entries(chartTitles).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );

};

export default App;