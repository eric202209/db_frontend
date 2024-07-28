import React, { useState, useEffect, Suspense } from 'react';
import { Chart as ChartJS, LinearScale } from 'chart.js';
ChartJS.register(LinearScale);
import axios from 'axios';
import './App.css';

const Chart = React.lazy(() => import('./Chart'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const DataTable = React.lazy(() => import('./DataTable'));
const FilterPanel = React.lazy(() => import('./FilterPanel'));
const ComparisonView = React.lazy(() => import('./ComparisonView'));

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

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState('avgConsMake');
    const [comparisonItems, setComparisonItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [filter, setFilter] = useState({});

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    const fetchData = async () => {
        setLoading(true);
        const cachedData = localStorage.getItem('dashboardData');
        if (cachedData) {
            setData(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('/api/data', { params: filter });
            setData(response.data);
            localStorage.setItem('dashboardData', JSON.stringify(response.data));
        } catch (err) {
            setError('Failed to fetch data. Please try again later.');
            console.error('Error fetching data:', err);
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

    // Check if selectedChart data is available and is an array
    const filteredData = Array.isArray(data[selectedChart])
        ? data[selectedChart].filter(item => 
            item.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.model?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];  // Default to an empty array if data is not available or not an array

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + data[selectedChart].map(row => Object.values(row).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fuel_consumption_data.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <h1>Fuel Consumption Dashboard</h1>
            <Dashboard/>
        </div>,
        <div className="app">
            <h1>Fuel Consumption Dashboard</h1>
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
                Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
            <Suspense fallback={<div>Loading...</div>}>
                <FilterPanel onFilterChange={setFilter} />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select onChange={(e) => setSelectedChart(e.target.value)} value={selectedChart}>
                    {Object.entries(chartTitles).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
                {filteredData.length > 0 ? (
                    <Chart data={filteredData} title={chartTitles[selectedChart]} type={selectedChart} />
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
                <button onClick={exportToCSV}>Export to CSV</button>
            </Suspense>
        </div>
    );
};

export default App;
