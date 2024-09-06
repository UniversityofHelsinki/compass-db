const dbApi = require ("../api/dbApi.js");

 exports.insertanswer = async (req, res) => {
    try {
        let answer = req.body;
        await dbApi.insertanswer(answer);
        res.json([{message: 'Answer stored'}]);
    } catch (error) {
        logger.error(`error inserting answer`);
        throw error;
    }
}
