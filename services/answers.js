const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');
const database = require("./database");

 exports.saveAnswer = async (req, res) => {
    try {
        let answer = req.body;
        return res.json(await dbApi.saveAnswer(answer));
        //logger.info(`Answer stored`)
        //res.json({message: messageKeys.MESSAGE_ANSWER_SAVED});
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

 exports.getAnswer = async (assignment_id) => {
     if (!assignment_id) {
         throw new Error(
             `assignment ${assignment_id} must be defined.`
         );
     }
     console.log('getAnswer kutsuttiin');
     return await dbApi.getAnswer(assignment_id);
 }


exports.getAssignmentCourse = async (assignment_id) => {
    if (!assignment_id) {
        throw new Error(
            `assignment ${assignment_id} must be defined.`
        );
    }
    console.log('getAssignmentCourse', assignment_id);
    return await database.execute('course/assignmentCourse.sql', [assignment_id]);
};

exports.getAnswerAssignmentCourse = async (assignment_id) => {
    if (!assignment_id) {
        throw new Error(
            `assignment ${assignment_id} must be defined.`
        );
    }
    console.log('getAnswerAssignmentCourse', assignment_id);
    return await database.execute('student/answerAssignmentCourse.sql', [assignment_id]);
};



