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

exports.addstudent = async (student) => {
    try {
        const insertStudentSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addStudent.sql"), "utf8");
        await database.query(insertStudentSQL,[student.user_id, new Date()]);
    } catch (err) {
        logger.error(`Error inserting student : ${err} `);
        throw err;
    }
}

exports.addstudenttocourse = async (student) => {
    try {
        const insertStudentToCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addStudentToCourse.sql"), "utf8");
        await database.query(insertStudentToCourseSQL,[student.user_id, student.course_id]);
    } catch (err) {
        logger.error(`Error inserting student to course : ${err} `);
        throw err;
    }
}

exports.isstudentincourse = async (student) => {
    try {
        const isStudentInCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/isStudentInCourse.sql"), "utf8");
        const result = await database.query(isStudentInCourseSQL, [student.user_id, student.course_id]);
        return result.length > 0;
    } catch (err) {
        logger.error(`Error checking if student is in course : ${err} `);
        throw err;
    }
}

exports.studentExist = async (student) => {
    try {
        const studentExistSQL = fs.readFileSync(path.resolve(__dirname, "../sql/studentExist.sql"), "utf8");
        const result = await database.query(studentExistSQL, [student.user_id]);
        return result.length > 0;
    } catch (err) {
        logger.error(`Error checking if student is in database : ${err} `);
        throw err;
    }
}
