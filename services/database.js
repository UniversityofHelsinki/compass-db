// Postgres client setup
import Pool from 'pg-pool';

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.SSL ? true : false
})

export const query = async (text, values) => {
    try {
        const results = await pool.query(text, values);
        if (results?.rowCount === 1) {
            return results.rows[0];
        } else if (results?.rowCount > 1) {
            return results.rows;
        }
        return results;
    } catch (error) {
        console.error(error.message);
        throw new Error(
            `Error while querying database ${error.message}`,
            { cause: error }
        );
    }
};

export default {
    query
};
