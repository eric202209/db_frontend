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
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data' });
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
