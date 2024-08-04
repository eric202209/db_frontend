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

// Helper function to fetch filtered data
async function fetchFilteredData(vehicles) {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Create placeholders for each vehicle
        const vehiclePlaceholders = vehicles.map((_, index) => `:vehicle${index + 1}`).join(', ');
        const query = `
            SELECT model_year, make, model, vehicle_class, engine_size, cylinders,
                   transmission, fuel_type, city_consumption, highway_consumption,
                   combined_consumption, combined_mpg, co2_emissions, co2_rating, smog_rating
            FROM fuel_consumption_ratings
            WHERE model_year || ' ' || make || ' ' || model || ' ' || vehicle_class || ' ' || transmission || ' ' || fuel_type IN (${vehiclePlaceholders})
        `;

        // Flatten the vehicles into a list for binding
        const bindValues = vehicles;

        console.log('Executing query:', query);
        console.log('With parameters:', bindValues);

        const result = await connection.execute(query, bindValues);
        return result.rows;
    } catch (err) {
        console.error('Error fetching filtered data:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// API Routes
// API endpoint to get filtered data
app.get('/api/filtered-data', async (req, res) => {
    try {
        const { vehicles } = req.query;
        const selectedVehicles = JSON.parse(vehicles);
        const data = await fetchFilteredData(selectedVehicles);
        res.json(data);
    } catch (err) {
        console.error('Failed to apply filters:', err);
        res.status(500).send('Failed to fetch filtered data');
    }
});


// API routes
app.get('/api/vehicle-options', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const query = `
            SELECT DISTINCT MODEL_YEAR, MAKE, MODEL, VEHICLE_CLASS, TRANSMISSION, FUEL_TYPE,
                   MODEL_YEAR || ' ' || MAKE || ' ' || MODEL || ' ' || VEHICLE_CLASS || ' ' || TRANSMISSION || ' ' || FUEL_TYPE AS vehicle_option
            FROM fuel_consumption_ratings
            ORDER BY MODEL_YEAR DESC, MAKE, MODEL, VEHICLE_CLASS, TRANSMISSION, FUEL_TYPE
        `;
        
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        const vehicleOptions = result.rows.map(row => row.VEHICLE_OPTION);

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
        
        const queries = {
            avgConsMake: 'SELECT model_year, make, avg_cons FROM temp_avg_cons_make',
            topEfficient: 'SELECT * FROM temp_top_efficient',
            fuelTypeDist: 'SELECT * FROM temp_fuel_type_dist',
            co2ByClass: 'SELECT * FROM temp_co2_by_class',
            bestSmog: 'SELECT * FROM temp_best_smog',
            consByTrans: 'SELECT * FROM temp_cons_by_trans',
            co2RatingPct: 'SELECT * FROM temp_co2_rating_pct',
            topLowCo2: 'SELECT * FROM temp_top_low_co2'
        };

        const results = await Promise.all(
            Object.keys(queries).map(async key => {
                const result = await connection.execute(queries[key], [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
                return { [key]: result.rows };
            })
        );

        // Combine results into a single object
        const response = results.reduce((acc, item) => Object.assign(acc, item), {});

        res.json(response);
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

// Catch-all route
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
