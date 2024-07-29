import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Chart = React.lazy(() => import('./Chart'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const DataTable = React.lazy(() => import('./DataTable'));
const FilterPanel = React.lazy(() => import('./FilterPanel'));
const ComparisonView = React.lazy(() => import('./ComparisonView'));
const AnalysisResults = React.lazy(() => import('./AnalysisResults'));

const App = () => {
    const [data, setData] = useState({
        filteredVehicles: [],
        avgConsMake: [],
        co2ByClass: [],
        fuelTypeDist: [],
        bestSmog: [],
        consByTrans: [],
        co2RatingPct: [],
        topLowCo2: [],
        topEfficient: [],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState('avgConsMake');
    const [comparisonItems, setComparisonItems] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState({
        modelYear: [],
        make: [],
        model: [],
        vehicleClass: [],
        engineSize: [],
        cylinder: [],
        transmission: [],
        fuelType: []
    });

    const chartTitles = {
        avgConsMake: 'Avg Consumption by Make Year',
        co2ByClass: 'CO2 Emissions by Class',
        fuelTypeDist: 'Fuel Type Distribution',
        bestSmog: 'Best Smog Ratings',
        consByTrans: 'Consumption by Transmission',
        co2RatingPct: 'CO2 Rating Percentage',
        topLowCo2: 'Top Low CO2 Vehicles',
        topEfficient: 'Top Efficient Vehicles',
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/data');
                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('/api/filter-options');
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };
        fetchOptions();
    }, []);

    const handleFilterChange = async (filters) => {
        try {
            const response = await axios.get('/api/filtered-data', { params: filters });
            setData(prevData => ({ ...prevData, filteredVehicles: response.data }));
        } catch (err) {
            setError('Failed to apply filters. Please try again.');
            console.error('Error applying filters:', err);
        }
    };

    const handleComparisonToggle = (item) => {
        setComparisonItems(prevItems =>
            prevItems.includes(item)
                ? prevItems.filter(i => i !== item)
                : [...prevItems, item]
        );
    };

    const exportToCSV = () => {
        if (!data[selectedChart]) return;

        const csvContent = "data:text/csv;charset=utf-8,"
            + data[selectedChart].map(row => Object.values(row).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fuel_consumption_data.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="dashboard">
                <h1>Fuel Consumption Dashboard</h1>
                <button className="mode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                    Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>
                <Suspense fallback={<div className="loading">Loading...</div>}>
                    <FilterPanel onFilterChange={handleFilterChange} options={options} />
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="chart-selector">
                        <select onChange={(e) => setSelectedChart(e.target.value)} value={selectedChart}>
                            {Object.entries(chartTitles).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="chart">
                        {Array.isArray(data[selectedChart]) && data[selectedChart].length > 0 ? (
                            <Chart data={data[selectedChart]} title={chartTitles[selectedChart]} type={selectedChart} />
                        ) : (
                            <div className="no-data-message">No data available for the selected chart.</div>
                        )}
                    </div>
                    <div className="data-tables">
                        {Object.keys(chartTitles).map(key => (
                            <div className={`chart-section ${key}`} key={key}>
                                <h2>{chartTitles[key]}</h2>
                                {data[key] && data[key].length > 0 ? (
                                    <DataTable
                                        data={data[key]}
                                        onComparisonToggle={handleComparisonToggle}
                                    />
                                ) : (
                                    <p className="no-data-message">No data available for {chartTitles[key]}.</p>
                                )}
                            </div>
                        ))}
                    </div>
                    {comparisonItems.length > 0 && <ComparisonView items={comparisonItems} />}
                    <AnalysisResults data={data} />
                    <button className="export-button" onClick={exportToCSV}>Export to CSV</button>
                </Suspense>
            </div>
        </div>
    );
};

export default App;
