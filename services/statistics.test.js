const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { describe, afterEach, beforeEach, beforeAll, afterAll, expect } = require('@jest/globals');
const courses = require('./courses');
const assignments = require('./assignments');
const dbApi = require('../api/dbApi');
const database = require('../services/database');
const statistics = require('../services/statistics');

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

    await database.query(
        'CREATE TEMPORARY TABLE IF NOT EXISTS answer (' +
            'id SERIAL PRIMARY KEY, ' +
            'assignment_id INTEGER REFERENCES assignment(id), ' +
            'course_id VARCHAR(255) REFERENCES course(course_id), ' +
            'user_name VARCHAR(255), ' +
            'answer_value VARCHAR(255), ' +
            'order_nbr INTEGER, ' +
            'created TIMESTAMPTZ, ' +
            'edited TIMESTAMPTZ)',
    );
});

afterEach(async () => {
    await database.query('DROP TABLE IF EXISTS pg_temp.answer');
    await database.query('DROP TABLE IF EXISTS pg_temp.assignment');
    await database.query('DROP TABLE IF EXISTS pg_temp.course');
});

describe('statistics for course', () => {
    it('should return a single course statistics', async () => {
        const courseData = {
            course_id: 'A123456789',
            user_name: 'teacher@school.com',
            title: 'Sample Course',
            description: 'Course description',
            start_date: '2023-01-01T10:00:00Z',
            end_date: '2023-12-31T10:00:00Z',
        };

        const assignmentData = [
            {
                course_id: 'A123456789',
                topic: 'Math',
                start_date: '2023-01-02T10:00:00Z',
                end_date: '2023-02-01T10:00:00Z',
            },
            {
                course_id: 'A123456789',
                topic: 'Science',
                start_date: '2023-02-02T10:00:00Z',
                end_date: '2023-03-01T10:00:00Z',
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

        // Query the temporary table to check if the assignments were added
        const assignmentResult = await database.query(
            'SELECT * FROM assignment WHERE course_id = $1',
            [courseData.course_id],
        );
        const savedAssignments = assignmentResult.rows;

        // Check assignments count
        expect(savedAssignments.length).toBe(assignmentData.length);

        let index = 0;
        for (const assignment of savedAssignments) {
            const answer = {
                assignment_id: assignment.id,
                course_id: courseData.course_id,
                user_name: `student${index}@school.com`,
                answer_value: 'test',
                order_nbr: index,
            };
            await dbApi.saveAnswer(answer);
            index++;
        }

        const stats = await statistics.statisticsForCourse(savedCourse.id);

        const expectedStats = [
            {
                assignment_id: 1,
                course_id: 'A123456789',
                course_title: 'Sample Course',
                assignment_topic: 'Math',
                start_date: new Date('2023-01-02T10:00:00.000Z'),
                end_date: new Date('2023-02-01T10:00:00.000Z'),
                order_nbr: 0,
                order_nbr_percentage: '100.0000000000000000',
                answer_count: '1',
                avg_answer_level: '0.00000000000000000000',
            },
            {
                assignment_id: 2,
                course_id: 'A123456789',
                course_title: 'Sample Course',
                assignment_topic: 'Science',
                start_date: new Date('2023-02-02T10:00:00.000Z'),
                end_date: new Date('2023-03-01T10:00:00.000Z'),
                order_nbr: 1,
                order_nbr_percentage: '100.0000000000000000',
                answer_count: '1',
                avg_answer_level: '1.00000000000000000000',
            },
        ];
        expect(stats).toEqual(expectedStats);
    });
});

afterAll(async () => {
    await database.end();
});
