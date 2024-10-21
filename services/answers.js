const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');
const database = require("./database");

 exports.saveAnswer = async (req, res) => {
    try {
        let answer = req.body;
        return res.json(await dbApi.saveAnswer(answer));
    } catch (error) {
        logger.error(`error inserting answer`);
        const msg = error.message;
        logger.error(`Error POST /saveAnswer ${error} ${msg}  USER ${req.user.eppn}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER
        });
    }
 }

exports.student = async (student, course) => {
     return await database.execute('student/answers.sql', [student, course]);
}

 exports.getAnswer = async (assignment_id) => {
     if (!assignment_id) {
         throw new Error(
             `assignment ${assignment_id} must be defined.`
         );
     }
     console.log('getAnswer kutsuttiin');
     return await dbApi.getAnswer(assignment_id);
 }

exports.getAnswerAssignmentCourse = async (assignment_id, student) => {
    if (!assignment_id || assignment_id === 'undefined') {
        throw new Error(
            `assignment ${assignment_id} must be defined.`
        );
    }
    if (!student || student === 'undefined') {
        throw new Error(
            `student ${student} must be defined.`
        );
    }
    console.log('getAnswerAssignmentCourse', assignment_id, student);
    const result =  await database.execute('student/answerAssignmentCourse.sql', [assignment_id, student]);
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }
};



