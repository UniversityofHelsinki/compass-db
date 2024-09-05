const fs = require ("fs");
const path = require ("path");
const database = require ("../services/database.js");

exports.insertanswer = async (answer) => {
    try {
        const id = getMaxID();
        const insertAnswerSQL = fs.readFileSync(path.resolve(__dirname, "../sql/insertAnswer.sql"), "utf8");
        await database.query(insertAnswerSQL, [id, new Date(), answer.first_answer, answer.second_answer, multiple_choice_answer]);
    } catch (err) {
        logger.error(`Error inserting deletion date for videoId : ${videoId} ${err} ${err.message}`);
        throw err;
    }

    const getMaxID = async () => {
        try {
            const selectMaxId = fs.readFileSync(path.resolve(__dirname, "../sql/selectMaxId.sql"), "utf8");
            return await database.query(selectMaxId);
        } catch (err) {
            throw err;
        }
    };
}
