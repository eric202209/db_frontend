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
    const [comparisonData, setComparisonData] = useState([]);
    const [comparisonItems, setComparisonItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCharts, setSelectedCharts] = useState([]); 
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    const handleFilterChange = async (selectedVehicles) => {
        if (!selectedVehicles || selectedVehicles.length === 0) {
            setComparisonData([]);
            setError(null);
            return;
        }
        
        try {
            const response = await axios.get('/api/filtered-data', {
                params: { vehicles: JSON.stringify(selectedVehicles) }
            });

            // Log the response for debugging
            console.log('API response:', response);

            // Check if the response is JSON
            try {
                if (typeof response.data === 'string') {
                    response.data = JSON.parse(response.data);
                }
            } catch (e) {
                console.error('Error parsing JSON:', e);
                throw new Error('Invalid JSON format');
            }
            
            // Check if the response is an array
            if (Array.isArray(response.data)) {
                setComparisonData(response.data);
                setError(null);
            } else {
                console.error('Unexpected response format:', response.data);
                throw new Error('Unexpected response format');
            }
        } catch (err) {
            console.error('Failed to apply filters:', err);
            setError('Failed to apply filters. Please try again.');
        }
    };

    const handleComparisonToggle = (item) => {
        setComparisonItems(prevItems => {
            const itemExists = prevItems.some(i => i.label === item.label);
            if (itemExists) {
                return prevItems.filter(i => i.label !== item.label);
            } else if (prevItems.length < 3) {
                return [...prevItems, item];
            }
            return prevItems;
        });
    };

    const transformDataForChart = (data, chartType) => {
        switch(chartType) {
          case 'avgConsMake':
            return data.map(item => ({ label: item.MAKE, value: item.FUEL_CONSUMPTION_CITY }));
          case 'co2ByClass':
            return data.map(item => ({ label: item.VEHICLE_CLASS, value: item.CO2_EMISSIONS }));
          case 'fuelTypeDist':
            return data.map(item => ({ label: item.FUEL_TYPE, value: 1 })); // Count of each fuel type
          case 'bestSmog':
            return data.map(item => ({ label: `${item.MAKE} ${item.MODEL}`, value: item.SMOG_RATING }));
          case 'consByTrans':
            return data.map(item => ({ label: item.TRANSMISSION, value: item.FUEL_CONSUMPTION_COMBINED }));
          case 'co2RatingPct':
            return data.map(item => ({ label: `${item.MAKE} ${item.MODEL}`, value: item.CO2_RATING }));
          case 'topLowCo2':
            return data.map(item => ({ label: `${item.MAKE} ${item.MODEL}`, value: item.CO2_EMISSIONS }));
          case 'topEfficient':
            return data.map(item => ({ label: `${item.MAKE} ${item.MODEL}`, value: item.FUEL_CONSUMPTION_COMBINED }));
          default:
            return [];
        }
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
                    <FilterPanel onFilterChange={handleFilterChange} />
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
                                <h2>{chartTitles[chartType]}</h2>
                                {comparisonData.length > 0 ? (
                                <Chart 
                                    data={transformDataForChart(comparisonData, chartType)} 
                                    title={chartTitles[chartType]} 
                                    type={chartType} 
                                />
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
                            <h2>{chartTitles[key]}</h2>
                            {comparisonData.length > 0 ? (
                                <DataTable
                                    data={transformDataForChart(comparisonData, key)}
                                    onComparisonToggle={handleComparisonToggle}
                                    comparisonItems={comparisonItems}
                                />
                            ) : (
                                <p className="no-data-message">No data available for {chartTitles[key]}.</p>
                            )}
                            </div>
                        ))}
                    </div>
                    <div className="comparison-view">
                        <h2>Comparison View</h2>                        
                        <ComparisonView items={comparisonData} />
                    </div>
                    <div className="analysis-results">
                        <AnalysisResults data={data} comparisonData={comparisonData}/>
                    </div>
                    <button className="export-button" onClick={exportToCSV}>Export Data to CSV</button>
                </Suspense>
            </div>
        </div>
    );
};

export default App;
