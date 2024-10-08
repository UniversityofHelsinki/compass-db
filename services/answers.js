const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');

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

 exports.getAnswer = async (assignment_id) => {
    try {
        let response = await dbApi.getAnswer(assignment_id);
        if (user_found_in_course) {
            logger.info(`Answer found`)
            res.json(response);
        } else {
            logger.info(`User not found`)
            res.json({message: messageKeys.USER_NOT_EXIST});
        }
    } catch (error) {
        logger.error(`error answer not in the database`);
        const msg = error.message;
        logger.error(`Error GET /getAnswer ${error} ${msg}  USER ${req.params.user_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_USER_EXIST_IN_DATABASE
        });
    }
 }


