const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Pool = require('pg-pool');
const database = require("../services/database");

const setupDatabase = async () => {
    let pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        ssl: !!process.env.SSL,
        max: 1,
        idleTimeoutMillis: 0
    });

    database.end = () => pool.end();
    database.query = (text, values) => pool.query(text, values);
};

module.exports = { setupDatabase, database };
