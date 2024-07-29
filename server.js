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
        const { modelYear, make, model, vehicleClass, engineSize, cylinder, transmission, fuelType } = req.query;
        
        let query = `SELECT * FROM fuel_consumption_ratings WHERE 1=1`;
        const bindParams = {};
        
        if (modelYear) {
            query += ` AND model_year = :modelYear`;
            bindParams.modelYear = modelYear;
        }
        if (make) {
            query += ` AND make = :make`;
            bindParams.make = make;
        }
        if (model) {
            query += ` AND model = :model`;
            bindParams.model = model;
        }
        if (vehicleClass) {
            query += ` AND vehicleClass = :vehicleClass`;
            bindParams.vehicleClass = vehicleClass;
        }
        if (engineSize) {
            query += ` AND engineSize = :engineSize`;
            bindParams.engineSize = engineSize;
        }
        if (cylinder) {
            query += ` AND cylinder = :cylinder`;
            bindParams.cylinder = cylinder;
        }
        if (transmission) {
            query += ` AND transmission = :transmission`;
            bindParams.transmission = transmission;
        }
        if (fuelType) {
            query += ` AND fuelType = :fuelType`;
            bindParams.fuelType = fuelType;
        }
        // Add similar conditions for other filter parameters
        
        const result = await connection.execute(query, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
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

// the filter-options endpoint
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

        res.json({
            modelYear: modelYears.rows.map(row => row.MODEL_YEAR),
            make: makes.rows.map(row => row.MAKE),
            model: models.rows.map(row => row.MODEL),
            vehicleClass: vehicleClasses.rows.map(row => row.VEHICLE_CLASS),
            engineSize: engineSizes.rows.map(row => row.ENGINE_SIZE),
            cylinder: cylinders.rows.map(row => row.CYLINDERS),
            transmission: transmissions.rows.map(row => row.TRANSMISSION),
            fuelType: fuelTypes.rows.map(row => row.FUEL_TYPE)
        });
    } catch (err) {
        console.error('Error fetching filter options:', err);
        res.status(500).json({ error: 'An error occurred while fetching filter options' });
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


// Set Cache-Control headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Helmet for security
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrcElem: ["'self'", 
                            "http://ff.kis.v2.scr.kaspersky-labs.com", 
                            "ws://ff.kis.v2.scr.kaspersky-labs.com"],
        },    
    })
);

// API endpoint to fetch data
app.get('/api/data', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        
        // Fetch data from your temporary tables
        const avgConsMake = await connection.execute('SELECT * FROM temp_avg_cons_make');
        const topEfficient = await connection.execute('SELECT * FROM temp_top_efficient');
        const fuelTypeDist = await connection.execute('SELECT * FROM temp_fuel_type_dist');
        const co2ByClass = await connection.execute('SELECT * FROM temp_co2_by_class');
        const bestSmog = await connection.execute('SELECT * FROM temp_best_smog');
        const consByTrans = await connection.execute('SELECT * FROM temp_cons_by_trans');
        const co2RatingPct = await connection.execute('SELECT * FROM temp_co2_rating_pct');
        const topLowCo2 = await connection.execute('SELECT * FROM temp_top_low_co2');
        
        console.log('avgConsMake query result:', avgConsMake);
        console.log('topEfficient query result:', topEfficient);
        console.log('fuelTypeDist query result:', fuelTypeDist);
        console.log('co2ByClass query result:', co2ByClass);
        console.log('bestSmog query result:', bestSmog);
        console.log('consByTrans query result:', consByTrans);
        console.log('co2RatingPct query result:', co2RatingPct);
        console.log('topLowCo2 query result:', topLowCo2);

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

// Explicitly set MIME types for JS and CSS files
app.get('*.js', function (req, res, next) {
    res.type('application/javascript');
    next();
});

app.get('*.css', function (req, res, next) {
    res.type('text/css');
    next();
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on: http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database', err);
    });