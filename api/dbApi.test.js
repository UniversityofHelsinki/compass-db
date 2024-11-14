const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const {
    describe,
    afterEach,
    beforeEach,
    beforeAll,
    afterAll,
    test,
    expect,
} = require('@jest/globals');
const database = require('../services/database');
const dbApi = require('./dbApi');

beforeAll(async () => {
    await database.query(`-- Any initial setup SQL if required`);
});

beforeEach(async () => {
    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS USERS (
                                                       id serial PRIMARY KEY,
                                                       user_name VARCHAR(255) NOT NULL UNIQUE,
                                                       display_name VARCHAR(255),
                                                       created TIMESTAMP
        );
    `);

    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS USER_ROLE (
                                                           user_id integer REFERENCES USERS (id),
                                                           role VARCHAR(50)
        );
    `);

    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS course (
                                                        id SERIAL PRIMARY KEY,
                                                        course_id VARCHAR(255) UNIQUE,
                                                        user_name VARCHAR(255),
                                                        title VARCHAR(255),
                                                        description TEXT,
                                                        start_date TIMESTAMPTZ,
                                                        end_date TIMESTAMPTZ
        );
    `);

    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS assignment (
                                                            id SERIAL PRIMARY KEY,
                                                            course_id VARCHAR(255) REFERENCES course(course_id),
                                                            topic VARCHAR(255),
                                                            start_date TIMESTAMPTZ,
                                                            end_date TIMESTAMPTZ,
                                                            created TIMESTAMPTZ,
                                                            deadline TIMESTAMPTZ
        );
    `);

    await database.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS answer (
                                                        id SERIAL PRIMARY KEY,
                                                        assignment_id INTEGER REFERENCES assignment(id),
                                                        course_id VARCHAR(255) REFERENCES course(course_id),
                                                        user_name VARCHAR(255),
                                                        value VARCHAR(255),
                                                        order_nbr INTEGER,
                                                        created TIMESTAMP,
                                                        edited TIMESTAMP
        );
    `);

    // Insert a course
    await database.query(`
        INSERT INTO course (course_id, user_name, title, description, start_date, end_date) VALUES
            ('CS101', 'Alice', 'Intro to Computer Science', 'Basic concepts of computer science', now(), now() + interval '1 month');
    `);

    // Insert an assignment
    await database.query(`
        INSERT INTO assignment (course_id, topic, start_date, end_date, created) VALUES
            ('CS101', 'Introduction to Programming', now(), now() + interval '1 week', now());
    `);
});

afterEach(async () => {
    await wait(100);
    await database.query('DROP TABLE IF EXISTS pg_temp.user_role;');
    await database.query('DROP TABLE IF EXISTS pg_temp.users;');
    await database.query('DROP TABLE IF EXISTS pg_temp.answer;');
    await database.query('DROP TABLE IF EXISTS pg_temp.assignment;');
    await database.query('DROP TABLE IF EXISTS pg_temp.course;');
});

describe('Database tests', () => {
    test('Creates a new user to database', async () => {
        let users = await database.query('SELECT * FROM USERS');
        expect(users.rows[0]).toBeUndefined();

        await dbApi.addUser('john@helsinki.fi');

        let usersAfterInsertion = await database.query('SELECT * FROM USERS');
        expect(usersAfterInsertion.rows).toHaveLength(1);
        expect(usersAfterInsertion.rows[0].id).toEqual(1);
        expect(usersAfterInsertion.rows[0].user_name).toEqual('john@helsinki.fi');
    });

    test('Creates new teacher role for user', async () => {
        let users = await database.query('SELECT * FROM USERS');
        expect(users.rows[0]).toBeUndefined();

        await dbApi.addUser('john@helsinki.fi');

        let usersAfterInsertion = await database.query('SELECT * FROM USERS');
        expect(usersAfterInsertion.rows).toHaveLength(1);

        await dbApi.adduserRole('1', 'teacher');

        let userRoles = await database.query('SELECT * FROM USER_ROLE');
        expect(userRoles.rows).toHaveLength(1);
        expect(userRoles.rows[0].user_id).toEqual(1);
        expect(userRoles.rows[0].role).toEqual('teacher');
    });

    test('Insert Answer', async () => {
        const foundCourses = await database.query('SELECT * FROM course');
        expect(foundCourses.rows.length).toBe(1);

        const foundAssignments = await database.query('SELECT * FROM assignment');
        expect(foundAssignments.rows.length).toBe(1);

        const foundAnswers = await database.query('SELECT * FROM answer');
        expect(foundAnswers.rows.length).toBe(0);

        await dbApi.saveAnswer({
            user_name: 'Alice',
            course_id: 'CS101',
            value: 'Answer1',
            order_nbr: 1,
            assignment_id: foundAssignments.rows[0].id,
        });

        const answersAfterInsertion = await database.query('SELECT * FROM answer');
        expect(answersAfterInsertion.rows.length).toBe(1);
        expect(answersAfterInsertion.rows[0].value).toBe('Answer1');
    });

    test('Update Existing Answer', async () => {
        const foundAssignments = await database.query('SELECT * FROM assignment');

        const insertedAnswer = await dbApi.saveAnswer({
            user_name: 'Alice',
            course_id: 'CS101',
            value: 'Answer1',
            order_nbr: 1,
            assignment_id: foundAssignments.rows[0].id,
        });

        const updatedAnswer = await dbApi.saveAnswer({
            id: insertedAnswer.id,
            user_name: 'Alice',
            course_id: 'CS101',
            value: 'Updated Answer1',
            order_nbr: 1,
            assignment_id: foundAssignments.rows[0].id,
        });

        expect(updatedAnswer).not.toBeNull();
        expect(updatedAnswer.value).toBe('Updated Answer1');

        const answersAfterUpdate = await database.query('SELECT * FROM answer WHERE id = $1', [
            insertedAnswer.id,
        ]);
        expect(answersAfterUpdate.rows.length).toBe(1);
        expect(answersAfterUpdate.rows[0].value).toBe('Updated Answer1');
    });
});

afterAll(async () => {
    await database.end();
});
