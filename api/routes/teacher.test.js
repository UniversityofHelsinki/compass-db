const request = require('supertest');
const express = require('express');
const teacherRoutes = require('../../api/routes/teacher');

// Mocking modules
jest.mock('../../services/courses', () => ({
    save: jest.fn()
}));

jest.mock('../../services/assignments', () => ({
    save: jest.fn()
}));

const courses = require('../../services/courses');
const assignments = require('../../services/assignments');

// Create an instance of express app
const app = express();
app.use(express.json()); // Ensure the app can parse JSON bodies
const router = express.Router();
app.use('/api/teacher', router);
teacherRoutes(router);

let assignmentIdCounter = 1;

describe('POST /api/teacher/courses', () => {
    it('should save the course without assignments and return the course', async () => {
        const newCourse = {
            course_id: 'A123456789',
            user_name: 'teacher@school.com',
            title: 'Sample Course',
            description: 'Course description',
            start_date: '2023-01-01T10:00:00Z',
            end_date: '2023-12-31T10:00:00Z'
        };
        courses.save.mockResolvedValueOnce([newCourse]);

        const response = await request(app)
            .post('/api/teacher/courses') // Ensure the URL matches the mounted path
            .send(newCourse)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(newCourse);
        expect(courses.save).toHaveBeenCalledWith(newCourse);
    });

    it('should save the course with assignments and return the course with saved assignments', async () => {
        const newCourse = {
            course_id: 'A123456789',
            user_name: 'teacher@school.com',
            title: 'Sample Course',
            description: 'Course description',
            start_date: '2023-01-01T10:00:00Z',
            end_date: '2023-12-31T10:00:00Z'
        };

        const newAssignments = [
            {
                course_id: 'A123456789',
                topic: 'Math',
                start_date: '2023-01-02T10:00:00Z',
                end_date: '2023-02-01T10:00:00Z'
            },
            {
                course_id: 'A123456789',
                topic: 'Science',
                start_date: '2023-02-02T10:00:00Z',
                end_date: '2023-03-01T10:00:00Z'
            }
        ];

        const savedAssignments = newAssignments.map((assignment, index) => ({
            id: index + 1,
            ...assignment
        }));

        courses.save.mockResolvedValueOnce([newCourse]);
        assignments.save.mockImplementation((assignment) => {
            return Promise.resolve({
                id: assignmentIdCounter++,
                ...assignment
            });
        });

        const payload = { ...newCourse, assignments: newAssignments };

        const response = await request(app)
            .post('/api/teacher/courses') // Ensure the URL matches the mounted path
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual({
            ...newCourse,
            assignments: savedAssignments
        });
    });
});
