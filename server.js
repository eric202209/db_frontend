const express = require('express');
const path = require('path');
const helmet = require('helmet');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// console.log('All environment variables:', process.env);
// console.log('Environment variables:', Object.keys(process.env));

const dbConfig = {
    user:  process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// console.log('DB Config:', {
//     user: dbConfig.user,
//     password: dbConfig.password ? '[REDACTED]' : undefined,
//     connectString: dbConfig.connectString
// });

async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool created');
    } catch (err) {
        console.error('Error creating connection pool:', err);
        process.exit(1);
    }
}

// middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, 'public')));

// update your server to send appropriate cache-control headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// middleware
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

// api endpoint to fetch data
app.get('/api/data', async(req,res) => {
    let connection;
    try{
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
        })

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({error: 'Error fetching data'});
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch(err) {
                console.error('Error closing connection:', err);
            }
        }
    }
});

// Function to fetch data from Oracle DB
async function fetchData(filter) {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        // Build the SQL query with optional filters
        let query = 'SELECT * FROM fuel_consumption_ratings WHERE 1=1';
        const queryParams = {};

        if (filter.make) {
            query += ' AND make = :make';
            queryParams.make = filter.make;
        }
        if (filter.model) {
            query += ' AND model = :model';
            queryParams.model = filter.model;
        }
        if (filter.fuelType) {
            query += ' AND fuel_type = :fuelType';
            queryParams.fuelType = filter.fuelType;
        }
        if (filter.transmission) {
            query += ' AND transmission = :transmission';
            queryParams.transmission = filter.transmission;
        }
        if (filter.year) {
            query += ' AND year = :year';
            queryParams.year = filter.year;
        }

        const result = await connection.execute(query, queryParams);

        return result.rows;
    } catch (err) {
        console.error('Error fetching data from Oracle DB:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing Oracle DB connection:', err);
            }
        }
    }
}

// API endpoint for fetching data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fetchData(req.query);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Explicitly set MIME types for JS and CSS files
app.get('*.js', function (req, res, next) {
    res.type('application/javascript');
    next();
});

// Middleware to set proper MIME type for CSS files
app.get('*.css', function (req, res, next) {
    res.type('text/css');
    next();
});

// Serve your React application
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start server
initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on: http://localhost:${port}`);
    });
})
    .catch((err) => {
        console.error('Failed to initialize database:', err);
});
