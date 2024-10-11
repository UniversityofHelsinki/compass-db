const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');
const database = require("./database");

 exports.saveAnswer = async (req, res) => {
    try {
        let answer = req.body;
        await dbApi.saveAnswer(answer);
        logger.info(`Answer stored`)
        res.json({message: messageKeys.MESSAGE_ANSWER_SAVED});
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
