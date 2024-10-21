const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const { describe, afterEach, beforeEach, beforeAll, afterAll, expect } = require("@jest/globals");
const courses = require('./courses');
const assignments = require('./assignments');
const database = require("../services/database");

beforeAll(async () => {
    // Any initial database setups, if required
    await database.query(`-- Any initial setup SQL if required`);
});

beforeEach(async () => {
    await database.query('CREATE TEMPORARY TABLE IF NOT EXISTS course (' +
        'id SERIAL PRIMARY KEY, ' +
        'course_id VARCHAR(255) UNIQUE, ' +
        'user_name VARCHAR(255), ' +
        'title VARCHAR(255), ' +
        'description TEXT, ' +
        'start_date TIMESTAMPTZ, ' +
        'end_date TIMESTAMPTZ)');
});

afterEach(async () => {
    await wait(100);
    await database.query('DROP TABLE IF EXISTS pg_temp.course');
});

describe('Course and Assignments Service with Temporary Tables', () => {
    describe('save course and assignments', () => {
        it('should save a course and its assignments and return them', async () => {
            const courseData = {
                course_id: 'A123456789',
                user_name: 'teacher@school.com',
                title: 'Sample Course',
                description: 'Course description',
                start_date: '2023-01-01T10:00:00Z',
                end_date: '2023-12-31T10:00:00Z'
            };

            // Ensure there are no courses and assignments initially
            const foundCourses = await database.query('SELECT * FROM course');
            expect(foundCourses.rows.length).toBe(0);

            // Call the `save` method from the `courses` module to save course data
            await courses.save(courseData);

            // Query the temporary table to check if the course was added
            const result = await database.query('SELECT * FROM course WHERE course_id = $1', [courseData.course_id]);
            const savedCourse = result.rows[0];

            // Helper function to trim milliseconds from ISO string
            const trimMilliseconds = (dateString) => dateString.replace('.000Z', 'Z');

            // Trim milliseconds from the received date strings
            const trimmedStartDate = trimMilliseconds(savedCourse.start_date.toISOString());
            const trimmedEndDate = trimMilliseconds(savedCourse.end_date.toISOString());

            // Compare date fields
            expect(trimmedStartDate).toEqual(trimMilliseconds(courseData.start_date));
            expect(trimmedEndDate).toEqual(trimMilliseconds(courseData.end_date));

            // Check other fields
            expect(savedCourse.course_id).toEqual(courseData.course_id);
            expect(savedCourse.user_name).toEqual(courseData.user_name);
            expect(savedCourse.title).toEqual(courseData.title);
            expect(savedCourse.description).toEqual(courseData.description);
        });
    });
});

afterAll( done => {
    database.end().then(done());
});
