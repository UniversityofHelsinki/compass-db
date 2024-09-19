const fs = require ("fs");
const path = require ("path");
const {logger} = require("../logger");
const database = require("../services/database");

exports.insertanswer = async (answer) => {
    try {
        const insertAnswerSQL = fs.readFileSync(path.resolve(__dirname, "../sql/insertAnswer.sql"), "utf8");
        await database.query(insertAnswerSQL,
            [answer.studentid, new Date(), answer.topic_answer, answer.description_answer, parseInt(answer.multiple_choice_answer)]);
    } catch (err) {
        logger.error(`Error inserting answer : ${err} `);
        throw err;
    }
}

exports.addstudent = async (user_id) => {
    try {
        const insertStudentSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addStudent.sql"), "utf8");
        await database.query(insertStudentSQL,[user_id, new Date()]);
    } catch (err) {
        logger.error(`Error inserting student : ${err} `);
        throw err;
    }
}

exports.addstudenttocourse = async (user_id, course_id) => {
    try {
        const insertStudentToCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addStudentToCourse.sql"), "utf8");
        await database.query(insertStudentToCourseSQL,[user_id, course_id]);
    } catch (err) {
        logger.error(`Error inserting student to course : ${err} `);
        throw err;
    }
}

exports.isstudentincourse = async (user_id, course_id) => {
    try {
        let course_id_int = parseInt(course_id);
        const isStudentInCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/isStudentInCourse.sql"), "utf8");
        const result = await database.query(isStudentInCourseSQL, [user_id, course_id_int]);
        return result?.student === user_id && result?.course === course_id_int;
    } catch (err) {
        logger.error(`Error checking if student is in course : ${err} `);
        throw err;
    }
}

exports.studentExist = async (user_id) => {
    try {
        const studentExistSQL = fs.readFileSync(path.resolve(__dirname, "../sql/studentExist.sql"), "utf8");
        const result = await database.query(studentExistSQL, [user_id]);
        return result?.user_id === user_id;
    } catch (err) {
        logger.error(`Error checking if student is in database : ${err} `);
        throw err;
    }
}
