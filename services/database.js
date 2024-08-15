// Postgres client setup
import Pool from 'pg-pool';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
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
