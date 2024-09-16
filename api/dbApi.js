const fs = require ("fs");
const path = require ("path");
const database = require ("../services/database.js");
const {logger} = require("../logger");

exports.insertanswer = async (answer) => {
    try {
        const insertAnswerSQL = fs.readFileSync(path.resolve(__dirname, "../sql/insertAnswer.sql"), "utf8");
        await database.query(insertAnswerSQL,
            [answer.studentid, 1, answer.topic_answer, answer.description_answer, parseInt(answer.multiple_choice_answer)]);
    } catch (err) {
        logger.error(`Error inserting answer : ${err} `);
        throw err;
    }
}

