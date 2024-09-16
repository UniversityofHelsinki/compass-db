const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');

 exports.insertanswer = async (req, res) => {
    try {
        let answer = req.body;
        await dbApi.insertanswer(answer);
        logger.info(`Answer stored`)
        res.json([{message: messageKeys.MESSAGE_ANSWER_SAVED}]);
    } catch (error) {
        logger.error(`error inserting answer`);
        const msg = error.message;
        logger.error(`Error GET /userInboxEvents ${error} ${msg}  USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER
        }]);
    }
}
