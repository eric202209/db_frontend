const express = require('express');
const path = require('path');
const helmet = require('helmet');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Database connection
async function initialize() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 4,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Connection pool created');
  } catch (err) {
    console.error('Error creating connection pool:', err);
    throw err;
  }
}

// API Routes
app.get('/api/filtered-data', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const { modelYear, make, model, vehicleClass } = req.query;
    
    let query = `SELECT * FROM fuel_consumption_ratings WHERE 1=1`;
    const bindParams = {};

    if (modelYear) {
      query += ` AND MODEL_YEAR = :modelYear`;
      bindParams.modelYear = modelYear;
    }
    if (make) {
      query += ` AND MAKE = :make`;
      bindParams.make = make;
    }
    if (model) {
      query += ` AND MODEL = :model`;
      bindParams.model = model;
    }
    if (vehicleClass) {
      query += ` AND VEHICLE_CLASS = :vehicleClass`;
      bindParams.vehicleClass = vehicleClass;
    }

    const result = await connection.execute(query, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching filtered data:', err);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
});

app.get('/api/filter-options', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();

    const modelYears = await connection.execute('SELECT DISTINCT model_year FROM fuel_consumption_ratings ORDER BY model_year');
    const makes = await connection.execute('SELECT DISTINCT make FROM fuel_consumption_ratings ORDER BY make');
    const models = await connection.execute('SELECT DISTINCT model FROM fuel_consumption_ratings ORDER BY model');
    const vehicleClasses = await connection.execute('SELECT DISTINCT vehicle_class FROM fuel_consumption_ratings ORDER BY vehicle_class');

    res.json({
      modelYear: modelYears.rows.map(row => row.MODEL_YEAR),
      make: makes.rows.map(row => row.MAKE),
      model: models.rows.map(row => row.MODEL),
      vehicleClass: vehicleClasses.rows.map(row => row.VEHICLE_CLASS)
    });
  } catch (err) {
    console.error('Error fetching filter options:', err);
    res.status(500).json({ error: 'An error occurred while fetching filter options' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

app.get('/api/data', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    
    const avgConsMake = await connection.execute('SELECT * FROM temp_avg_cons_make');
    const topEfficient = await connection.execute('SELECT * FROM temp_top_efficient');
    const fuelTypeDist = await connection.execute('SELECT * FROM temp_fuel_type_dist');
    const co2ByClass = await connection.execute('SELECT * FROM temp_co2_by_class');
    const bestSmog = await connection.execute('SELECT * FROM temp_best_smog');
    const consByTrans = await connection.execute('SELECT * FROM temp_cons_by_trans');
    const co2RatingPct = await connection.execute('SELECT * FROM temp_co2_rating_pct');
    const topLowCo2 = await connection.execute('SELECT * FROM temp_top_low_co2');
    
    res.json({
      avgConsMake: avgConsMake.rows,
      topEfficient: topEfficient.rows,
      fuelTypeDist: fuelTypeDist.rows,
      co2ByClass: co2ByClass.rows,
      bestSmog: bestSmog.rows,
      consByTrans: consByTrans.rows,
      co2RatingPct: co2RatingPct.rows,
      topLowCo2: topLowCo2.rows
    });
  } catch (err) {
    console.error('Error in /api/data:', err);
    res.status(500).json({ error: 'An error occurred while fetching analysis data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
});    

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrcElem: ["'self'", "http://ff.kis.v2.scr.kaspersky-labs.com", "ws://ff.kis.v2.scr.kaspersky-labs.com"],
    },
  })
);

app.get('*.js', (req, res, next) => {
  res.type('application/javascript');
  next();
});

app.get('*.css', (req, res, next) => {
  res.type('text/css');
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on: http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database', err);
  });
