const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { describe, afterEach, beforeEach, beforeAll, afterAll, expect } = require('@jest/globals');
const courses = require('./courses');
const assignments = require('./assignments');
const database = require('../services/database');

beforeAll(async () => {
    // Any initial database setups, if required
    await database.query(`-- Any initial setup SQL if required`);
});

beforeEach(async () => {
    await database.query(
        'CREATE TEMPORARY TABLE IF NOT EXISTS course (' +
            'id SERIAL PRIMARY KEY, ' +
            'course_id VARCHAR(255) UNIQUE, ' +
            'user_name VARCHAR(255), ' +
            'title VARCHAR(255), ' +
            'description TEXT, ' +
            'start_date TIMESTAMPTZ, ' +
            'end_date TIMESTAMPTZ)',
    );

    await database.query(
        'CREATE TEMPORARY TABLE IF NOT EXISTS assignment (' +
            'id SERIAL PRIMARY KEY, ' +
            'course_id VARCHAR(255) REFERENCES course(course_id), ' +
            'topic VARCHAR(255), ' +
            'start_date TIMESTAMPTZ, ' +
            'end_date TIMESTAMPTZ, ' +
            'created TIMESTAMPTZ, ' +
            'deadline TIMESTAMPTZ)',
    );
});

afterEach(async () => {
    await wait(100);
    await database.query('DROP TABLE IF EXISTS pg_temp.assignment');
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
                end_date: '2023-12-31T10:00:00Z',
                research_authorization: '1',
            };

            const assignmentData = [
                {
                    course_id: 'A123456789',
                    topic: 'Math',
                    start_date: '2023-01-02T10:00:00Z',
                    end_date: '2023-02-01T10:00:00Z',
                    order_nbr_percentage: '100.0000000000000000',
                    answer_count: '1',
                    avg_answer_level: '0.00000000000000000000',
                },
                {
                    course_id: 'A123456789',
                    topic: 'Science',
                    start_date: '2023-02-02T10:00:00Z',
                    end_date: '2023-03-01T10:00:00Z',
                    order_nbr_percentage: '100.0000000000000000',
                    answer_count: '1',
                    avg_answer_level: '1.00000000000000000000',
                },
            ];

            // Ensure there are no courses and assignments initially
            const foundCourses = await database.query('SELECT * FROM course');
            expect(foundCourses.rows.length).toBe(0);

            const foundAssignments = await database.query('SELECT * FROM assignment');
            expect(foundAssignments.rows.length).toBe(0);

            // Call the `save` method from the `courses` module to save course data
            await courses.save(courseData);

            // Query the temporary table to check if the course was added
            const result = await database.query('SELECT * FROM course WHERE course_id = $1', [
                courseData.course_id,
            ]);
            const savedCourse = result.rows[0];

            expect(savedCourse.id).not.toBeNull();

            // Call the `save` method from the `assignments` module to save assignment data
            for (const assignment of assignmentData) {
                await assignments.save(assignment);
            }

            // Helper function to trim milliseconds from ISO string
            const trimMilliseconds = (dateString) => dateString.replace('.000Z', 'Z');

            // Query the temporary table to check if the assignments were added
            const assignmentResult = await database.query(
                'SELECT * FROM assignment WHERE course_id = $1',
                [courseData.course_id],
            );
            const savedAssignments = assignmentResult.rows;

            // Check assignments count
            expect(savedAssignments.length).toBe(assignmentData.length);

            // Check assignments data
            for (let i = 0; i < assignmentData.length; i++) {
                const trimmedStartDate = trimMilliseconds(
                    savedAssignments[i].start_date.toISOString(),
                );
                const trimmedEndDate = trimMilliseconds(savedAssignments[i].end_date.toISOString());

                expect(savedAssignments[i].course_id).toEqual(assignmentData[i].course_id);
                expect(savedAssignments[i].topic).toEqual(assignmentData[i].topic);
                expect(trimmedStartDate).toEqual(assignmentData[i].start_date);
                expect(trimmedEndDate).toEqual(assignmentData[i].end_date);
                expect(assignmentData[i].created).not.toBeNull();
            }
        });
    });
});

afterAll((done) => {
    database.end().then(done());
});
