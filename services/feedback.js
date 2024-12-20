const dbApi = require('../api/dbApi.js');
const { logger } = require('../logger');
const messageKeys = require('../utils/message-keys');
const database = require('./database');

exports.saveFeedback = async (req, res) => {
    try {
        let feedback = req.body;
        logger.info('Feedback added/updated');
        return res.json(await dbApi.saveFeedback(feedback));
    } catch (error) {
        logger.error(`error inserting feedback`);
        const msg = error.message;
        logger.error(`Error POST /feedback ${error} ${msg}  USER ${req.body.user_name}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_FEEDBACK,
        });
    }
};

exports.feedbackForCourse = async (course_id) => {
    if (!course_id) {
        throw new Error(` ${course_id} must be defined.`);
    }

    const result = await database.execute('feedback/feedbackForCourse.sql', [course_id]);
    if (result && result.length > 0) {
        return result;
    } else {
        return null;
    }
};

exports.feedbackForStudent = async (course_id, student, assignment_id) => {
    if (!course_id || !student || !assignment_id) {
        throw new Error(` ${course_id} ${student} ${assignment_id} must be defined.`);
    }

    const result = await database.execute('feedback/feedback.sql', [
        course_id,
        student,
        assignment_id,
    ]);
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }
};
