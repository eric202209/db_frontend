const oracledb = require('oracledb');
require('dotenv').config();

async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            //connectString: process.env.DB_CONNECT_STRING
            connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=199.212.26.208)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=SQLD)))'
        });
        console.log('Connected to database');
    } catch (err) {
        console.error('Error connecting to database:', err);
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

testConnection();