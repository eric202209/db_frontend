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

// Testing
app.get('/api/filter-options', (req, res) => {
    const filterOptions = {
        modelYear: ["2024"],
        make: ["Toyota", "Ford"],
        model: ["Camry SE", "Escape"],
        vehicleClass: ["Mid-size", "Sport utility vehicle: Small"],
        engineSize: ["2.5", "1.5"],
        cylinder: ["4", "3"],
        transmission: ["AS8", "A8"],
        fuelType: ["X", "X"]
    };
    res.setHeader('Content-Type', 'application/json');
    res.json(filterOptions);
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
        console.log('Attempting to get connection...');
        connection = await oracledb.getConnection();
        console.log('Connection successful');

        // Fetch data from your temporary tables
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