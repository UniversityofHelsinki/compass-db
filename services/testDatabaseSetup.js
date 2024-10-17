const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Pool = require('pg-pool');
const database = require("../services/database");
const { readFile } = require('fs').promises;

const execute = async (file, values) => {
    if (!file) {
        throw new Error('The "file" argument is required and must be a non-empty string.');
    }

    try {
        const filePath = path.resolve(__dirname, '../sql', file);
        const sql = await readFile(filePath, 'utf8');
        const results = await database.query(sql, values);
        return results;
    } catch (error) {
        console.error(`Error while reading SQL file ${file}: ${error.message}`);
        throw new Error(
            `Error while reading SQL file ${file} with values ${JSON.stringify(values)}`,
            { cause: error }
        );
    }
};


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
    database.execute = execute;
};

module.exports = { setupDatabase, database };
