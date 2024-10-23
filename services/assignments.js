const database = require('../services/database.js');
const fs = require('fs');
const path = require('path');
const { logger } = require('../logger');

const columns = (assignment) => {
    const keys = ['course_id', 'topic', 'start_date', 'end_date'];
    const values = keys.map((key) => assignment[key]);
    if (assignment.id) {
        return [assignment.id, ...values];
    }
    return values;
};

exports.save = async (assignment) => {
    if (!assignment) {
        throw new Error(`assignment ${assignment} must be defined.`);
    }
    return await database.execute('assignment/save.sql', columns(assignment));
};

exports.update = async (assignment) => {
    if (!assignment) {
        throw new Error(`assignment ${assignment} must be defined.`);
    }
    return await database.execute('assignment/update.sql', columns(assignment));
};

exports.remove = async (assignment) => {
    if (!assignment) {
        throw new Error(`assignment ${assignment} must be defined.`);
    }
    return await database.execute('assignment/delete.sql', [assignment.id]);
};

exports.forCourse = async (course) => {
    if (!course) {
        throw new Error(`course ${course} must be defined.`);
    }
    return await database.execute('course/assignments.sql', [course]);
};

exports.student = async (course, student) => {
    if (!course || !student) {
        throw new Error(`course ${course} and student ${student} must be defined.`);
    }
    return await database.execute('course/studentAssignments.sql', [course, student]);
};

exports.singleAssignment = (req, res) => {
    const { course, assignment, student } = req.params;
    return res.json([]);
};

exports.assignment = async (assignment_id) => {
    if (!assignment_id) {
        throw new Error(`assignment ${assignment_id} must be defined.`);
    }
    return await database.execute('course/assignment.sql', [assignment_id]);
};

exports.getAssignmentCourse = async (assignment_id) => {
    if (!assignment_id) {
        throw new Error(`assignment ${assignment_id} must be defined.`);
    }
    console.log('getAssignmentCourse', assignment_id);
    const result = await database.execute('course/assignmentCourse.sql', [assignment_id]);
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }
};
