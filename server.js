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
    const { modelYear, make, model, vehicleClass, engineSize, cylinder, transmission, fuelType, smogRating, topEfficient } = req.query;
    
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
    if (engineSize) {
      query += ` AND ENGINE_SIZE = :engineSize`;
      bindParams.engineSize = engineSize;
    }
    if (cylinder) {
      query += ` AND CYLINDERS = :cylinder`;
      bindParams.cylinder = cylinder;
    }
    if (transmission) {
      query += ` AND TRANSMISSION = :transmission`;
      bindParams.transmission = transmission;
    }
    if (fuelType) {
      query += ` AND FUEL_TYPE = :fuelType`;
      bindParams.fuelType = fuelType;
    }
    if (smogRating) {
      query += ` AND SMOG_RATING = :smogRating`;
      bindParams.smogRating = smogRating;
    }
    if (topEfficient) {
      query += ` AND COMBINED_CONSUMPTION = :topEfficient`;
      bindParams.topEfficient = topEfficient;
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
    const engineSizes = await connection.execute('SELECT DISTINCT engine_size FROM fuel_consumption_ratings ORDER BY engine_size');
    const cylinders = await connection.execute('SELECT DISTINCT cylinders FROM fuel_consumption_ratings ORDER BY cylinders');
    const transmissions = await connection.execute('SELECT DISTINCT transmission FROM fuel_consumption_ratings ORDER BY transmission');
    const fuelTypes = await connection.execute('SELECT DISTINCT fuel_type FROM fuel_consumption_ratings ORDER BY fuel_type');
    const smogRatings = await connection.execute('SELECT DISTINCT smog_rating FROM fuel_consumption_ratings ORDER BY smog_rating');
    const topEfficients = await connection.execute('SELECT DISTINCT combined_consumption FROM fuel_consumption_ratings ORDER BY combined_consumption');

    res.json({
      modelYear: modelYears.rows.map(row => row.MODEL_YEAR).filter(value => value !== null),
      make: makes.rows.map(row => row.MAKE).filter(value => value !== null),
      model: models.rows.map(row => row.MODEL).filter(value => value !== null),
      vehicleClass: vehicleClasses.rows.map(row => row.VEHICLE_CLASS).filter(value => value !== null),
      engineSize: engineSizes.rows.map(row => row.ENGINE_SIZE).filter(value => value !== null),
      cylinder: cylinders.rows.map(row => row.CYLINDERS).filter(value => value !== null),
      transmission: transmissions.rows.map(row => row.TRANSMISSION).filter(value => value !== null),
      fuelType: fuelTypes.rows.map(row => row.FUEL_TYPE).filter(value => value !== null),
      smogRating: smogRatings.rows.map(row => row.SMOG_RATING).filter(value => value !== null),
      topEfficient: topEfficients.rows.map(row => row.COMBINED_CONSUMPTION).filter(value => value !== null)
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
