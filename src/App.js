import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import './App.css';

const Chart = React.lazy(() => import('./Chart'));
const FilterPanel = React.lazy(() => import('./FilterPanel'));
const DataTable = React.lazy(() => import('./DataTable'));
const ComparisonView = React.lazy(() => import('./ComparisonView'));
const AnalysisResults = React.lazy(() => import('./AnalysisResults'));

const App = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCharts, setSelectedCharts] = useState([]); 
    const [comparisonItems, setComparisonItems] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [options, setOptions] = useState({});

    const chartTitles = {
        avgConsMake: 'Average Consumption',
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
                const response = await axios.get('/api/vehicle-options');
                // setOptions({ vehicleOptions: response.data });
                setOptions(response.data);
            } catch (error) {
                setError('Failed to load filter options');
            }
        };
        fetchOptions();
    }, []);

    const handleFilterChange = async (selectedVehicles) => {
        if (selectedVehicles.length === 0) {
            setError('No vehicles selected. Please select at least one vehicle.');
            return;
        }
        
        try {
            const response = await axios.get('/api/filtered-data', {
                params: { vehicles: JSON.stringify(selectedVehicles) }
            });
            setData(prevData => ({ ...prevData, filteredVehicles: response.data }));
        } catch (err) {
            setError('Failed to apply filters. Please try again.');
        }
    };

    const handleComparisonToggle = (item) => {
        setComparisonItems(prevItems => {
            const itemExists = prevItems.some(i => i.id === item.id);
            if (itemExists) {
                return prevItems.filter(i => i.id !== item.id);
            } else if (prevItems.length < 3) {
                return [...prevItems, item];
            }
            return prevItems;
        });
    };

    const exportToCSV = () => {
        if (selectedCharts.length === 0) return;

        const csvContent = selectedCharts.map(chartType => {
            if (!data[chartType]) return '';
            return `\n\n${chartTitles[chartType]}\n`
                + data[chartType].map(row => Object.values(row).join(",")).join("\n");
        }).join("\n");

        const csvData = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", csvData);
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
                    <FilterPanel onFilterChange={handleFilterChange} options={options.vehicleOptions || []} />
                    <div className="chart-selector">
                        <select multiple onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions, option => option.value);
                            setSelectedCharts(options);
                        }} value={selectedCharts}>
                            {Object.entries(chartTitles).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="charts">
                        {selectedCharts.length > 0 ? (
                            selectedCharts.map(chartType => (
                                <div key={chartType} className="chart-section">
                                    <h2 class="centered-title">{chartTitles[chartType]}</h2>
                                    {Array.isArray(data[chartType]) && data[chartType].length > 0 ? (
                                        <Chart data={data[chartType]} title={chartTitles[chartType]} type={chartType} />
                                    ) : (
                                        <div className="no-data-message">No data available for {chartTitles[chartType]}.</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-data-message">No charts selected.</div>
                        )}
                    </div>
                    <div className="data-table">
                        {Object.keys(chartTitles).map(key => (
                            <div className={`chart-section ${key}`} key={key}>
                                <h2 class="centered-title">{chartTitles[key]}</h2>
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
                    <div className="comparison-view">
                        <h2>Comparison View</h2>
                        {comparisonItems.length > 0 && <ComparisonView items={comparisonItems} />}
                    </div>
                    <div className="analysis-results">
                        <AnalysisResults data={data} />
                    </div>
                    <button className="export-button" onClick={exportToCSV}>Export Data to CSV</button>
                </Suspense>
            </div>
        </div>
    );
};

export default App;
