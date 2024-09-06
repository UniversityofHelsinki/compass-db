const fs = require ("fs");
const path = require ("path");
const database = require ("../services/database.js");
const {logger} = require("../logger");

exports.insertanswer = async (answer) => {
    try {
        const id = await getMaxID();
        const insertAnswerSQL = fs.readFileSync(path.resolve(__dirname, "../sql/insertAnswer.sql"), "utf8");
        await database.query(insertAnswerSQL, [id.max_value, new Date(), answer.first_answer, answer.second_answer, parseInt(answer.multiple_choice_answer)]);
    } catch (err) {
        logger.error(`Error inserting answer : ${err} `);
        throw err;
    }
}
const getMaxID = async () => {
    try {
        const selectMaxId = fs.readFileSync(path.resolve(__dirname, "../sql/selectMaxId.sql"), "utf8");
        return await database.query(selectMaxId);
    } catch (err) {
        throw err;
    }
};
