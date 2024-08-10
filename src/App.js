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
          // Group by MAKE and calculate average COMBINED_CONSUMPTION
          const makeGroups = data.reduce((acc, item) => {
            if (!acc[item.MAKE]) acc[item.MAKE] = [];
            acc[item.MAKE].push(item.COMBINED_CONSUMPTION);
            return acc;
          }, {});
          return Object.entries(makeGroups).map(([make, consumptions]) => ({
            label: make,
            value: consumptions.reduce((sum, val) => sum + val, 0) / consumptions.length
          }));
    
        case 'consByTrans':
          // Group by TRANSMISSION and calculate average COMBINED_CONSUMPTION
          const transGroups = data.reduce((acc, item) => {
            if (!acc[item.TRANSMISSION]) acc[item.TRANSMISSION] = [];
            acc[item.TRANSMISSION].push(item.COMBINED_CONSUMPTION);
            return acc;
          }, {});
          return Object.entries(transGroups).map(([transmission, consumptions]) => ({
            label: transmission,
            value: consumptions.reduce((sum, val) => sum + val, 0) / consumptions.length
          }));
    
        case 'co2ByClass':
          return data.map(item => ({ label: item.VEHICLE_CLASS, value: item.CO2_EMISSIONS }));
    
        case 'fuelTypeDist':
          const fuelTypeCounts = data.reduce((acc, item) => {
            acc[item.FUEL_TYPE] = (acc[item.FUEL_TYPE] || 0) + 1;
            return acc;
          }, {});
          return Object.entries(fuelTypeCounts).map(([fuelType, count]) => ({ label: fuelType, value: count }));
    
        case 'bestSmog':
          return data.map(item => ({ label: `${item.MAKE} ${item.MODEL}`, value: item.SMOG_RATING }));
    
        case 'co2RatingPct':
          console.log('Sample item for co2RatingPct:', data[0]);
          // Calculate percentage for each co2_rating
          const co2Ratings = data.reduce((acc, item) => {
            if (!acc[item.co2_rating]) acc[item.co2_rating] = 0;
            acc[item.co2_rating]++;
            return acc;
          }, {});
          const total = Object.values(co2Ratings).reduce((sum, count) => sum + count, 0);
          return Object.entries(co2Ratings).map(([rating, count]) => ({
            label: rating,
            value: (count / total) * 100
          }));

        case 'topLowCo2':
          console.log('Sample item for topLowCo2:', data[0]);
          // Group by make and calculate average co2_emissions
          const makeGroup2 = data.reduce((acc, item) => {
            if (!acc[item.make]) acc[item.make] = [];
            acc[item.make].push(parseFloat(item.co2_emissions));
            return acc;
          }, {});
          return Object.entries(makeGroup2)
            .map(([make, emissions]) => ({
              label: make,
              value: emissions.reduce((sum, val) => sum + val, 0) / emissions.length
            }))
            .sort((a, b) => a.value - b.value)
            .slice(0, 10);

        case 'topEfficient':
          return data.map(item => ({ label: `${item.MAKE} ${item.MODEL}`, value: item.COMBINED_CONSUMPTION }));
    
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
                            type={chartType === 'co2RatingPct' ? 'pie' : 'bar'} 
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

              <div className="comparison-view">
                <h2>Vehicle Comparison</h2>
                {loading ? (
                  <div className="loading">Loading comparison data...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : comparisonData.length > 0 ? (
                  <ComparisonView items={comparisonData} />
                ) : (
                  <div className="no-data-message">Select vehicles to compare.</div>
                )}
              </div>

              {/* <div className="data-table">
                {comparisonData.length > 0 && (
                  <div className="data-table">
                    <h2>Vehicle Data Table</h2>
                    <DataTable data={comparisonData} onComparisonToggle={handleComparisonToggle} />
                  </div>
                )}
              </div> */}
              
              {/* Use comparisonItems */}
              {comparisonItems.length > 0 && (
                <div className="selected-comparisons">
                  <h2>Selected for Comparison</h2>
                  {comparisonItems.map((item, index) => (
                    <div key={index} className="comparison-item">
                      {item.label}
                      <button onClick={() => handleComparisonToggle(item)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

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
