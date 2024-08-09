const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Oracle DB Configuration
const dbConfig = {
  user: 'COMP214_M24_zou_47',
  password: '520520.Shi',
  connectString: '199.212.26.208:1521/SQLD',
};

// Helper function to fetch data
const fetchData = async (query) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing the connection:', closeErr.message);
      }
    }
  }
};

// API to fetch average consumption by make
app.get('/api/avgConsMake', async (req, res) => {
  try {
    const data = await fetchData('SELECT make, avg_cons FROM temp_avg_cons_make');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/avgConsMake:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch top efficient vehicles
app.get('/api/topEfficient', async (req, res) => {
  try {
    const data = await fetchData('SELECT make, model, comb_cons FROM temp_top_efficient');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/topEfficient:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch fuel type distribution
app.get('/api/fuelTypeDist', async (req, res) => {
  try {
    const data = await fetchData('SELECT fuel_type, count_ft FROM temp_fuel_type_dist');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/fuelTypeDist:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch CO2 by class
app.get('/api/co2ByClass', async (req, res) => {
  try {
    const data = await fetchData('SELECT veh_class, avg_co2 FROM temp_co2_by_class');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/co2ByClass:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch best smog ratings
app.get('/api/bestSmog', async (req, res) => {
  try {
    const data = await fetchData('SELECT make, model, smog_rating FROM temp_best_smog');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/bestSmog:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch consumption by transmission
app.get('/api/consByTrans', async (req, res) => {
  try {
    const data = await fetchData('SELECT trans, avg_cons FROM temp_cons_by_trans');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/consByTrans:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch CO2 rating percentage
app.get('/api/co2RatingPct', async (req, res) => {
  try {
    const data = await fetchData('SELECT co2_rating, count_cr, percentage FROM temp_co2_rating_pct');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/co2RatingPct:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

// API to fetch top low CO2 vehicles
app.get('/api/topLowCo2', async (req, res) => {
  try {
    const data = await fetchData('SELECT make, avg_co2 FROM temp_top_low_co2');
    res.json(data);
  } catch (err) {
    console.error('Error in /api/topLowCo2:', err.message);
    res.status(500).send('Error retrieving data from database');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
