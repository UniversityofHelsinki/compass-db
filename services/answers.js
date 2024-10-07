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

exports.getUserAnswersForCourseId = async (req, res) => {
     try {
         const userName = req.params.user_name;
         const courseId = req.params.course_id;
         const courseAnswers = await dbApi.getUserAnswersForCourseId(userName, courseId);
         res.json(courseAnswers);
     } catch (error) {
         logger.error(`error getting course answers for user`);
         const msg = error.message;
         logger.error(`Error GET /getUserAnswersForCourseId ${error} ${msg} USER ${req.params.user_name}`);
         res.status(500);
         return res.json([{
             message: messageKeys.ERROR_MESSAGE_FAILED_TO_GET_COURSE_ANSWERS
         }]);
     }
}
