const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const dbApi = require('../api/dbApi');
const {describe, afterEach, beforeEach, beforeAll, afterAll, expect} = require("@jest/globals");
const {setupDatabase, database} = require("../services/testDatabaseSetup");

/**
 * Global setup before any tests run.
 * Initializes the connection pool with configuration from environment variables.
 * Overrides database's end and query methods to use this pool.
 */
beforeAll(async () => {
    await setupDatabase();
});

/**
 * Setup before each test.
 * Creates temporary USERS and USER_ROLE tables for isolation.
 */
beforeEach(async () => {
    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS USERS (
            id serial,
            user_name VARCHAR(255) NOT NULL UNIQUE,
            created TIMESTAMP,
            PRIMARY KEY(id)
        );
    `);
    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS USER_ROLE (
            user_id integer REFERENCES USERS (id),
            role VARCHAR(50)
        );
    `);
});

/**
 * Teardown after each test.
 * Drops the temporary tables to ensure a clean slate for the next test.
 * Waits for 100ms to ensure all resources are released.
 */
afterEach(async () => {
    await wait(100);
    await database.query('DROP TABLE IF EXISTS pg_temp.user_role');
    await database.query('DROP TABLE IF EXISTS pg_temp.users');
});

/**
 * Test suite for database operations.
 */
describe('Database tests', () => {
    /**
     * Test if a new user can be added to the database.
     */
    it('creates a new user to database', async () => {
        let users = await database.query('SELECT * FROM users');
        expect(users.rows[0]).toBeUndefined();

        await dbApi.adduser('john@helsinki.fi');

        let usersAfterInsertion = await database.query('SELECT * FROM users');
        expect(usersAfterInsertion.rows).toHaveLength(1);
        expect(usersAfterInsertion.rows[0].id).toEqual(1);
        expect(usersAfterInsertion.rows[0].user_name).toEqual('john@helsinki.fi');
    });

    /**
     * Test if a new role can be assigned to a user.
     */
    it('creates new teacher role for user', async () => {
        let users = await database.query('SELECT * FROM users');
        expect(users.rows[0]).toBeUndefined();

        await dbApi.adduser('john@helsinki.fi');

        let usersAfterInsertion = await database.query('SELECT * FROM users');
        expect(usersAfterInsertion.rows).toHaveLength(1);

        await dbApi.adduserRole('1', 'teacher');

        let userRoles = await database.query('SELECT * FROM user_role');
        expect(userRoles.rows).toHaveLength(1);
        expect(userRoles.rows[0].user_id).toEqual(1);
        expect(userRoles.rows[0].role).toEqual('teacher');
    });
});

/**
 * Global teardown after all tests run.
 * Closes the database connection pool.
 */
afterAll(done => {
    database.end().then(done());
});
