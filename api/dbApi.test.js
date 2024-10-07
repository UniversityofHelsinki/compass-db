const path = require("path");
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const Pool = require('pg-pool');
const client = require("../services/database");
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const dbApi = require('../api/dbApi');

beforeAll(async () => {
    const pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.DATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        ssl: process.env.SSL ? true : false,
        max: 1, // Reuse the connection to make sure we always hit the same temporal schema
        idleTimeoutMillis: 0 // Disable auto-disconnection of idle clients to make sure we always hit the same temporal schema
    });

    client.end = () => {
        return pool.end();
    };

    client.query = (text, values) => {
        return pool.query(text, values);
    };
});

beforeEach(async () => {
    await client.query('CREATE TEMPORARY TABLE IF NOT EXISTS USERS (\n' +
        '    id serial,\n' +
        '    user_name VARCHAR(255) NOT NULL UNIQUE,\n' +
        '    created TIMESTAMP,\n' +
        '    PRIMARY KEY(id)\n' +
        ');');
    await client.query('CREATE TEMPORARY TABLE IF NOT EXISTS USER_ROLE (\n' +
        '    user_id integer REFERENCES USERS (id),\n' +
        '    role VARCHAR(50)\n' +
        ');')
});

afterEach(async () => {
    await wait(100);
    await client.query('DROP TABLE IF EXISTS pg_temp.user_role');
    await client.query('DROP TABLE IF EXISTS pg_temp.users');
});

describe('Database tests', () => {
    it('creates a new user to database', async () => {
        let users = await client.query('SELECT * FROM users');
        expect(users.rows[0]).toBeUndefined();
        dbApi.adduser('john@helsinki.fi')
        let usersAfterInsertion = await client.query('SELECT * FROM users');
        expect(usersAfterInsertion.rows).toHaveLength(1);
        expect(usersAfterInsertion.rows[0].id).toEqual(1);
        expect(usersAfterInsertion.rows[0].user_name).toEqual('john@helsinki.fi');
    });

    it('creates new teacher role for user', async () => {
        let users = await client.query('SELECT * FROM users');
        expect(users.rows[0]).toBeUndefined();
        await dbApi.adduser('john@helsinki.fi')
        let usersAfterInsertion = await client.query('SELECT * FROM users');
        expect(usersAfterInsertion.rows).toHaveLength(1);
        await dbApi.adduserRole('1', 'teacher');
        let userRoles = await client.query('SELECT * FROM user_role');
        expect(userRoles.rows).toHaveLength(1);
        expect(userRoles.rows[0].user_id).toEqual(1);
        expect(userRoles.rows[0].role).toEqual('teacher');
    })
});

afterAll( done => {
    client.end().then(done());
});

