const express = require('express');
const path = require('path');
const helmet = require('helmet');
const oracledb = require('oracledb');
require('dotenv').config();

const envConfig = {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_CONNECT_STRING: process.env.DB_CONNECT_STRING,
    PORT: process.env.PORT || 3000
};

const port = envConfig.PORT;
const app = express();

async function initialize() {
    try {
        await oracledb.createPool({
            user: envConfig.DB_USER,
            password: envConfig.DB_PASSWORD,
            connectString: envConfig.DB_CONNECT_STRING
        });
        console.log('Connection pool created');
    } catch (err) {
        console.error('Error creating connection pool:', err);
        throw err;
    }
}

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, 'build')));

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

        // Use the filter parameters
        const { make, fuelType, transmission, year } = req.query;

        const avgConsMakeQuery = `
            SELECT make, avg_cons
            FROM temp_avg_cons_make
            WHERE (:make IS NULL OR make = :make)
        `;
        const avgConsMake = await connection.execute(avgConsMakeQuery, { make });

        const topEfficientQuery = `
            SELECT make, model, comb_cons
            FROM temp_top_efficient
            WHERE (:make IS NULL OR make = :make)
        `;
        const topEfficient = await connection.execute(topEfficientQuery, { make });

        const fuelTypeDistQuery = `
            SELECT fuel_type, count_ft
            FROM temp_fuel_type_dist
            WHERE (:fuelType IS NULL OR fuel_type = :fuelType)
        `;
        const fuelTypeDist = await connection.execute(fuelTypeDistQuery, { fuelType });

        const co2ByClassQuery = `
            SELECT veh_class, avg_co2
            FROM temp_co2_by_class
        `;
        const co2ByClass = await connection.execute(co2ByClassQuery);

        const bestSmogQuery = `
            SELECT make, model, smog_rating
            FROM temp_best_smog
            WHERE (:make IS NULL OR make = :make)
        `;
        const bestSmog = await connection.execute(bestSmogQuery, { make });

        const consByTransQuery = `
            SELECT trans, avg_cons
            FROM temp_cons_by_trans
            WHERE (:transmission IS NULL OR trans = :transmission)
        `;
        const consByTrans = await connection.execute(consByTransQuery, { transmission });

        const co2RatingPctQuery = `
            SELECT co2_rating, count_cr, percentage
            FROM temp_co2_rating_pct
        `;
        const co2RatingPct = await connection.execute(co2RatingPctQuery);

        const topLowCo2Query = `
            SELECT make, avg_co2
            FROM temp_top_low_co2
            WHERE (:make IS NULL OR make = :make)
        `;
        const topLowCo2 = await connection.execute(topLowCo2Query, { make });

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
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing database connection:', err);
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

// Serve your React application
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on: http://localhost:${port}`);
        });
    });