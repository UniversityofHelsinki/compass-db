const fs = require('fs');
const path = require('path');
const { logger } = require('../logger');
const database = require('../services/database');
const messageKeys = require('../utils/message-keys');

exports.saveAnswer = async (answer) => {
    try {
        if (answer.id) {
            //answer already in database
            const insertAnswerSQL = fs.readFileSync(
                path.resolve(__dirname, '../sql/insertOrUpdateAnswer.sql'),
                'utf8',
            );
            const result = await database.query(insertAnswerSQL, [
                answer.id,
                answer.user_name,
                answer.course_id,
                new Date(),
                answer.answer_value,
                parseInt(answer.order_nbr),
                answer.assignment_id,
                new Date(),
            ]);
            if (result && result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } else {
            //insert answer
            const insertAnswerSQL = fs.readFileSync(
                path.resolve(__dirname, '../sql/insertAnswer.sql'),
                'utf8',
            );
            const result = await database.query(insertAnswerSQL, [
                answer.user_name,
                answer.course_id,
                new Date(),
                answer.answer_value,
                parseInt(answer.order_nbr),
                answer.assignment_id,
                new Date(),
            ]);
            if (result && result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        }
    } catch (err) {
        logger.error(`Error inserting answer : ${err} `);
        throw err;
    }
};

exports.deleteFeedback = async (id) => {
    try {
        //delete feedback
        return await database.execute('../sql/feedback/deleteFeedback.sql', [id]);
    } catch (err) {
        logger.error(`Error deleting feedback : ${err} `);
        throw err;
    }
};

exports.saveFeedback = async (feedback) => {
    try {
        if (feedback.id) {
            //feedback already in database
            const insertOrUpdateFeedback = fs.readFileSync(
                path.resolve(__dirname, '../sql/feedback/insertOrUpdateFeedback.sql'),
                'utf8',
            );
            const result = await database.query(insertOrUpdateFeedback, [
                feedback.id,
                feedback.user_name,
                feedback.course_id,
                new Date(),
                feedback.feedback_value,
                feedback.order_nbr !== null ? parseInt(feedback.order_nbr) : null,
                feedback.assignment_id,
            ]);
            if (result && result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } else {
            //insert feedback
            const insertAnswerSQL = fs.readFileSync(
                path.resolve(__dirname, '../sql/feedback/insertFeedback.sql'),
                'utf8',
            );
            const result = await database.query(insertAnswerSQL, [
                feedback.user_name,
                feedback.course_id,
                new Date(),
                feedback.feedback_value,
                feedback.order_nbr !== null ? parseInt(feedback.order_nbr) : null,
                feedback.assignment_id,
                feedback.student,
            ]);
            if (result && result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        }
    } catch (err) {
        logger.error(`Error inserting feedback : ${err} `);
        throw err;
    }
};

exports.addUser = async (userName, displayName) => {
    try {
        const insertUserSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/addUser.sql'),
            'utf8',
        );
        const result = await database.query(insertUserSQL, [userName, new Date(), displayName]);
        if (result?.rowCount > 0) {
            return result?.rows[0]?.id;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(`Error inserting user : ${err} `);
        throw err;
    }
};

exports.adduserRole = async (user_id, role) => {
    try {
        const insertUserRolesSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/addUserRole.sql'),
            'utf8',
        );
        return await database.query(insertUserRolesSQL, [user_id, role]);
    } catch (err) {
        logger.error(`Error inserting role : ${err} `);
        throw err;
    }
};

exports.addcourse = async (data) => {
    try {
        let user_id = data.user_id;
        let course_id = data.course_id;
        let title = data.title;
        let description = data.description;
        let start_date = data.start_date;
        let end_date = data.end_date;
        let research_authorization = data.research_authorization;
        const insertUserToCourseSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/addCourse.sql'),
            'utf8',
        );
        return await database.query(insertUserToCourseSQL, [
            user_id,
            course_id,
            title,
            description,
            start_date,
            end_date,
            research_authorization,
        ]);
    } catch (err) {
        logger.error(`Error adding course : ${err} `);
        throw err;
    }
};

exports.connectusertocourse = async (data) => {
    try {
        let user_id = data.user_id;
        let course_id = data.course_id;
        let research_authorization =
            data.research_authorization === '1'
                ? true
                : data.research_authorization === null
                  ? null
                  : false;
        const insertUserToCourseSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/connectUserToCourse.sql'),
            'utf8',
        );
        return await database.query(insertUserToCourseSQL, [
            course_id,
            user_id,
            research_authorization,
        ]);
    } catch (err) {
        logger.error(`Error adding user to course : ${err} `);
        throw err;
    }
};

exports.updateuserincourse = async (data) => {
    try {
        let user_name = data.user_name;
        let course_id = data.course_id;
        let research_authorization = data.research_authorization;
        const updateUserInCourseSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/user_course/updateUserInCourse.sql'),
            'utf8',
        );
        return await database.query(updateUserInCourseSQL, [
            research_authorization,
            course_id,
            user_name,
        ]);
    } catch (err) {
        logger.error(`Error updating user in user_course : ${err} `);
        throw err;
    }
};

exports.isuserincourse = async (user_id, course_id) => {
    try {
        const isUserInCourseSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/isUserInCourse.sql'),
            'utf8',
        );
        const result = await database.query(isUserInCourseSQL, [user_id, course_id]);
        if (result && result.rowCount > 0) {
            return result.rows[0]?.user_name === user_id && result.rows[0]?.course_id === course_id;
        } else {
            return false;
        }
    } catch (err) {
        logger.error(`Error checking if user is in course : ${err} `);
        throw err;
    }
};

exports.userCourse = async (student, course_id) => {
    try {
        const isUserInCourseSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/isUserInCourse.sql'),
            'utf8',
        );
        const result = await database.query(isUserInCourseSQL, [student, course_id]);
        if (result && result.rowCount > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (err) {
        logger.error(`Error reading user_course table : ${err} `);
        throw err;
    }
};

exports.userExist = async (userName) => {
    try {
        const userExistSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/userExist.sql'),
            'utf8',
        );
        const result = await database.query(userExistSQL, [userName]);
        return result?.rowCount > 0;
    } catch (err) {
        logger.error(`Error checking if user is in database: ${err}`);
        throw err;
    }
};

exports.getAnswersByAssignmentId = async (assignmentId) => {
    try {
        const answerSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/student/answer.sql'),
            'utf8',
        );
        const result = await database.query(answerSQL, [parseInt(assignmentId)]);
        if (result && result.rowCount > 0) {
            return result.rows;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(`Error reading answer with assignment_id ${assignmentId} : ${err} `);
        throw err;
    }
};

exports.getAnswersAndFeedbacksByAssignmentId = async (assignmentId) => {
    try {
        const answerSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/teacher/answersAndFeedbacks.sql'),
            'utf8',
        );
        const result = await database.query(answerSQL, [parseInt(assignmentId)]);
        if (result && result.rowCount > 0) {
            return result.rows;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(
            `Error reading answers and feedbacks with assignment_id ${assignmentId} : ${err} `,
        );
        throw err;
    }
};

exports.getUserByUserId = async (userId) => {
    try {
        const getUserSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/getUserById.sql'),
            'utf8',
        );
        const result = await database.query(getUserSQL, [userId]);
        if (result && result.rowCount > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (err) {
        logger.error('Error reading user with userID : ' + userId + ' : ' + err);
        throw err;
    }
};

exports.getUserByUserName = async (userName) => {
    try {
        const getUserSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/getUserByUserName.sql'),
            'utf8',
        );
        const result = await database.query(getUserSQL, [userName]);
        if (result && result.rowCount > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (err) {
        logger.error('Error reading user with username : ' + userName + ' : ' + err);
        throw err;
    }
};

exports.getUserId = async (userName) => {
    try {
        const userIDSQL = fs.readFileSync(path.resolve(__dirname, '../sql/getUserId.sql'), 'utf8');
        const result = await database.query(userIDSQL, [userName]);
        if (result && result.rowCount > 0) {
            return result.rows[0]?.id;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(`Error reading user id with username ${userName} : ${err} `);
        throw err;
    }
};

exports.getUserRoles = async (userId) => {
    try {
        const getUserRolesSQL = fs.readFileSync(
            path.resolve(__dirname, '../sql/getUserRoles.sql'),
            'utf8',
        );
        const result = await database.query(getUserRolesSQL, [userId]);
        if (result.rowCount > 0) {
            return result.rows;
        } else {
            return [];
        }
    } catch (err) {
        logger.error(`Error reading user roles with userId ${userId} : ${err} `);
        throw err;
    }
};

exports.removeUserRole = async (userId, foundRole) => {
    const removeUserRoleSQL = fs.readFileSync(
        path.resolve(__dirname, '../sql/removeUserRole.sql'),
        'utf8',
    );
    return await database.query(removeUserRoleSQL, [userId, foundRole]);
};
