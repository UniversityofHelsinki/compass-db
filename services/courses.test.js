const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Pool = require('pg-pool');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const client = require("../services/database");
const { describe, afterEach, beforeEach, beforeAll, afterAll, expect } = require("@jest/globals");
const courses = require('./courses');

beforeAll(async () => {
    pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        ssl: !!process.env.SSL,
        max: 1,
        idleTimeoutMillis: 0
    });

    client.end = () => pool.end();
    client.query = (text, values) => pool.query(text, values);
});

beforeEach(async () => {
    await client.query('CREATE TEMPORARY TABLE course (id SERIAL PRIMARY KEY, course_id VARCHAR(255) UNIQUE, user_name VARCHAR(255), title VARCHAR(255), description TEXT, start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)');
});

afterEach(async () => {
    await wait(100);
    await client.query('DROP TABLE IF EXISTS course');
});

describe('Courses Service with Temporary Tables', () => {
    describe('save', () => {
        it('should save a course and return it', async () => {
            const courseData = {
                course_id: 'A123456789',
                user_name: 'teacher@school.com',
                title: 'Sample Course',
                description: 'Course description',
                start_date: '2023-01-01T10:00:00Z',
                end_date: '2023-12-31T10:00:00Z'
            };

            // Ensure there are no courses initially
            const foundCourses = await client.query('SELECT * FROM course');
            expect(foundCourses.rows.length).toBe(0);

            // Call the `save` method from the `courses` module
            await courses.save(courseData);

            // Query the temporary table to check if the course was added
            const result = await client.query('SELECT * FROM course WHERE course_id = $1', [courseData.course_id]);
            const savedCourse = result.rows[0];

            // Helper function to trim milliseconds from ISO string
            const trimMilliseconds = (dateString) => dateString.replace('.000Z', 'Z');

            // Trim milliseconds from the received date strings
            const trimmedStartDate = trimMilliseconds(savedCourse.start_date.toISOString());
            const trimmedEndDate = trimMilliseconds(savedCourse.end_date.toISOString());

            // Compare date fields
            expect(trimmedStartDate).toEqual(courseData.start_date);
            expect(trimmedEndDate).toEqual(courseData.end_date);

            // Check other fields
            expect(savedCourse.course_id).toEqual(courseData.course_id);
            expect(savedCourse.user_name).toEqual(courseData.user_name);
            expect(savedCourse.title).toEqual(courseData.title);
            expect(savedCourse.description).toEqual(courseData.description);
        });
    });
});

afterAll(async () => {
    await client.end();
});
