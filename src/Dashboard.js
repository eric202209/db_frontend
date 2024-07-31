import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterPanel from './FilterPanel'; 
import ComparisonView from './ComparisonView'; 
import AnalysisResults from './AnalysisResults';

const Dashboard = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [analysisData, setAnalysisData] = useState({});
    const [comparisonItems, setComparisonItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalysisData();
    }, []);

    const fetchAnalysisData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/analysis-data');
            setAnalysisData(response.data);
        } catch (err) {
            setError('Failed to fetch analysis data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = async (filters) => {
        try {
            const response = await axios.get('/api/filtered-data', { params: filters });
            setFilteredData(response.data);
        } catch (err) {
            setError('Failed to apply filters. Please try again.');
        }
    };

    const handleComparisonToggle = (item) => {
        setComparisonItems(prevItems =>
            prevItems.some(i => i.id === item.id)
                ? prevItems.filter(i => i.id !== item.id)
                : [...prevItems, item]
        );
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard">
            <FilterPanel onFilterChange={handleFilterChange} />
            <div className="filtered-results">
                <h2>Filtered Results</h2>
                {filteredData.map((vehicle) => (
                    <div key={vehicle.id} className="vehicle-item">
                        <p>{`${vehicle.modelYear} ${vehicle.make} ${vehicle.model}`}</p>
                        <button onClick={() => handleComparisonToggle(vehicle)}>
                            {comparisonItems.some(i => i.id === vehicle.id) ? 'Remove from Comparison' : 'Add to Comparison'}
                        </button>
                    </div>
                ))}
            </div>
            {comparisonItems.length > 0 && <ComparisonView items={comparisonItems} />}
            <AnalysisResults data={analysisData} />
        </div>
    );
};

export default Dashboard;