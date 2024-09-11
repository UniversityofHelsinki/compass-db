const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");

 exports.insertanswer = async (req, res) => {
    try {
        let answer = req.body;
        await dbApi.insertanswer(answer);
        logger.info(`Answer stored`)
        res.json([{message: 'Answer stored'}]);
    } catch (error) {
        logger.error(`error inserting answer`);
        throw error;
    }
}
