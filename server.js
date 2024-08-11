const express = require('express');
const path = require('path');
const helmet = require('helmet');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

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
        const query = `
            SELECT model_year, make, model, vehicle_class, engine_size, cylinders,
                transmission, fuel_type, city_consumption, highway_consumption,
                combined_consumption, combined_mpg, co2_emissions, co2_rating, smog_rating
            FROM fuel_consumption_ratings
            WHERE (model_year = :year AND make = :make 
                AND LOWER(model) LIKE LOWER(:model) || '%'
                AND LOWER(vehicle_class) LIKE LOWER(:class) || '%'
                AND LOWER(transmission) LIKE LOWER(:transmission) || '%'
                AND LOWER(fuel_type) LIKE LOWER(:fuel) || '%')
        `;
        console.log('Received vehicles:', vehicles);
        const results = await Promise.all(vehicles.map(async (vehicle, index) => {
            let bindParams;
            if (typeof vehicle === 'string') {
                const parts = vehicle.split(' ');
                bindParams = {
                    year: parseInt(parts[0]),
                    make: parts[1],
                    model: parts.slice(2, -3).join(' '),
                    class: parts[parts.length - 3],
                    transmission: parts[parts.length - 2],
                    fuel: parts[parts.length - 1]
                };
            } else {
                bindParams = {
                    year: vehicle.MODEL_YEAR,
                    make: vehicle.MAKE,
                    model: vehicle.MODEL,
                    class: vehicle.VEHICLE_CLASS,
                    transmission: vehicle.TRANSMISSION,
                    fuel: vehicle.FUEL_TYPE
                };
            }
       
            console.log(`Executing query for vehicle ${index + 1}:`, query);
            console.log(`Parameters for vehicle ${index + 1}:`, bindParams);
            const result = await connection.execute(query, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            console.log(`Result for vehicle ${index + 1}:`, result.rows);
            return result.rows;
        }));
        const flatResults = results.flat();
        console.log('Final results:', flatResults);
        return flatResults;
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

// API endpoint to get filtered data
app.get('/api/filtered-data', async (req, res) => {
    try {
        const { vehicles } = req.query;
        console.log('Received vehicles query:', vehicles);
        const selectedVehicles = JSON.parse(vehicles);
        console.log('Parsed selected vehicles:', selectedVehicles);

        if (!selectedVehicles || selectedVehicles.length === 0) {
            return res.json([]); // Return an empty array instead of an error
        }

        const data = await fetchFilteredData(selectedVehicles);
        console.log('Data to be sent:', data);
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
            topEfficient: 'SELECT model_year, make, model, comb_cons FROM temp_top_efficient',
            fuelTypeDist: 'SELECT model_year, fuel_type, count_ft FROM temp_fuel_type_dist',
            co2ByClass: 'SELECT model_year, veh_class, avg_co2 FROM temp_co2_by_class',
            bestSmog: 'SELECT model_year, make, model, smog_rating FROM temp_best_smog',
            consByTrans: 'SELECT model_year, trans, avg_cons FROM temp_cons_by_trans',
            co2RatingPct: 'SELECT model_year, co2_rating, count_cr, percentage FROM temp_co2_rating_pct',
            topLowCo2: 'SELECT model_year, make, avg_co2 FROM temp_top_low_co2'
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

// Security headers with helmet
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        scriptSrcElem: ["'self'", "http://ff.kis.v2.scr.kaspersky-labs.com", "ws://ff.kis.v2.scr.kaspersky-labs.com"],
    },
}));

app.get('*.js', (req, res, next) => {
    res.type('application/javascript');
    next();
});

app.get('*.css', (req, res, next) => {
    res.type('text/css');
    next();
});

// Catch-all route for React app
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
