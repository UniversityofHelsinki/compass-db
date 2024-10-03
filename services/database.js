// Postgres client setup
const Pool = require ("pg-pool");
const { read } = require("../sql/read");

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.SSL ? true : false
})

const query = async (text, values) => {
    try {
      const results = await pool.query(text, values);
      if (results?.rowCount > 0) {
        return results.rows;
      }
      return [];
    } catch (error) {
        console.error(error.message);
        throw new Error(
            `Error while querying database ${error.message}`,
            { cause: error }
        );
    }
};

exports.query = query;

exports.execute = async (file, values) => {
  try {
    const sql = await read(file);
    const results = await query(sql, values);
    return results;
  } catch (error) {
    console.error(error.message);
    throw new Error(
      `Error while reading sql ${file} with values ${values}`,
      { cause: error }
    );
  }
};
