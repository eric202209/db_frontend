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
        const vehicles = req.query.vehicles ? JSON.parse(req.query.vehicles) : [];

        if (vehicles.length === 0) {
            return res.json([]);
        }

        const placeholders = vehicles.map((_, index) => `:vehicle${index}`).join(', ');
        const query = `
            SELECT model_year, make, model, vehicle_class, engine_size, cylinders,
                   transmission, fuel_type, city_consumption, highway_consumption,
                   combined_consumption, combined_mpg, co2_emissions, co2_rating, smog_rating
            FROM fuel_consumption_ratings
            WHERE MODEL_YEAR || ' ' || MAKE || ' ' || MODEL || ' ' || VEHICLE_CLASS IN (${placeholders})
        `;

        const bindParams = {};
        vehicles.forEach((vehicle, index) => {
            bindParams[`vehicle${index}`] = vehicle;
        });

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

app.get('/api/vehicle-options', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const query = `
            SELECT DISTINCT MODEL_YEAR, MAKE, MODEL, VEHICLE_CLASS,
                   MODEL_YEAR || ' ' || MAKE || ' ' || MODEL || ' ' || VEHICLE_CLASS AS vehicle_option
            FROM fuel_consumption_ratings
            ORDER BY MODEL_YEAR DESC, MAKE, MODEL, VEHICLE_CLASS
        `;
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        const vehicleOptions = result.rows.map(row => row.VEHICLE_OPTION);

        // console.log('Vehicle Options:', vehicleOptions); // Add logging
        res.setHeader('Content-Type', 'application/json');
        res.json(vehicleOptions);
    } catch (err) {
        console.error('Error fetching vehicle options:', err);
        res.status(500).json({ error: 'An error occurred while fetching vehicle options', details: err.message });
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