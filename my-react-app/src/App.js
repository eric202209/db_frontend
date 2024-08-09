import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/${endpoint}`);
      setData(response.data);
      console.log("response.data", response.data);
    } catch (err) {
      setError(`Error fetching ${endpoint} data`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Data Display</h1>
      <div>
        <button onClick={() => fetchData('avgConsMake')}>Average Consumption by Make</button>
        <button onClick={() => fetchData('topEfficient')}>Top Efficient Vehicles</button>
        <button onClick={() => fetchData('fuelTypeDist')}>Fuel Type Distribution</button>
        <button onClick={() => fetchData('co2ByClass')}>CO2 by Class</button>
        <button onClick={() => fetchData('bestSmog')}>Best Smog Ratings</button>
        <button onClick={() => fetchData('consByTrans')}>Consumption by Transmission</button>
        <button onClick={() => fetchData('co2RatingPct')}>CO2 Rating Percentage</button>
        <button onClick={() => fetchData('topLowCo2')}>Top Low CO2 Vehicles</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div>
        <h2>Data:</h2>
        <ul>
          {Array.isArray(data) && data.map((item, index) => (
            <li key={index}>
              {Object.values(item).join(' - ')} {/* Display data as joined string */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
