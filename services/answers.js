const dbApi = require('../api/dbApi.js');
const { logger } = require('../logger');
const messageKeys = require('../utils/message-keys');
const database = require('./database');

exports.saveAnswer = async (req, res) => {
    try {
        let answer = req.body;
        return res.json(await dbApi.saveAnswer(answer));
    } catch (error) {
        logger.error(`error inserting answer`);
        const msg = error.message;
        logger.error(`Error POST /saveAnswer ${error} ${msg}  USER ${req.body.user_name}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER,
        });
    }
};

exports.student = async (student, course) => {
    return await database.execute('student/answers.sql', [student, course]);
};

exports.getAnswersByAssignmentId = async (assignmentId) => {
    if (!assignmentId) {
        throw new Error(`assignment ${assignmentId} must be defined.`);
    }
    return await dbApi.getAnswersByAssignmentId(assignmentId);
};

exports.getAnswerAssignmentCourse = async (assignment_id, student, course) => {
    if (!assignment_id || assignment_id === 'undefined') {
        throw new Error(`assignment ${assignment_id} must be defined.`);
    }
    if (!student || student === 'undefined') {
        throw new Error(`student ${student} must be defined.`);
    }
    if (!course || course === 'undefined') {
        throw new Error(`course ${course} must be defined.`);
    }
    const result = await database.execute('student/answerAssignmentCourse.sql', [
        assignment_id,
        student,
        course,
    ]);
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }
};

exports.getCourseAssignments = async (course) => {
    if (!course || course === 'undefined') {
        throw new Error(`course ${course} must be defined.`);
    }
    const result = await database.execute('student/courseAssignments.sql', [course]);
    if (result && result.length > 0) {
        return result;
    } else {
        return null;
    }
};

exports.getCourseAssignments = async (course) => {
    if (!course || course === 'undefined') {
        throw new Error(`course ${course} must be defined.`);
    }
    const result = await database.execute('student/courseAssignments.sql', [course]);
    if (result && result.length > 0) {
        return result;
    } else {
        return null;
    }
};

exports.deleteStudentAnswer = async (req, res) => {
    try {
        let answer = req.body;
        return res.json(
            await database.execute('student/deleteUserAnswer.sql', [
                answer.assignment_id,
                answer.course_id,
                answer.user_name,
            ]),
        );
    } catch (error) {
        logger.error(`error deleting answer`);
        const msg = error.message;
        logger.error(
            `Error POST /deleteUserAnswer ${error} ${msg}  USER ${studentAnswer.user_name}`,
        );
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER,
        });
    }
};

exports.getAssignmentAnswers = async (req, res) => {};
