const fs = require ("fs");
const path = require ("path");
const {logger} = require("../logger");
const database = require("../services/database");

exports.insertanswer = async (answer) => {
    try {
        const insertAnswerSQL = fs.readFileSync(path.resolve(__dirname, "../sql/insertAnswer.sql"), "utf8");
        await database.query(insertAnswerSQL,
            [answer.studentid, answer.courseid, new Date(), answer.topic_answer, answer.description_answer, parseInt(answer.multiple_choice_answer)]);
    } catch (err) {
        logger.error(`Error inserting answer : ${err} `);
        throw err;
    }
}

exports.addUser = async (user_id) => {
    try {
        const insertUserSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addUser.sql"), "utf8");
        await database.query(insertUserSQL,[user_id, new Date()]);
    } catch (err) {
        logger.error(`Error inserting student : ${err} `);
        throw err;
    }
}

exports.connectUserToCourse = async (user_id, course_id) => {
    try {
        const insertUserToCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/connectUserToCourse.sql"), "utf8");
        await database.query(insertUserToCourseSQL,[user_id, course_id]);
    } catch (err) {
        logger.error(`Error inserting user to course : ${err} `);
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
        logger.error(`Error checking if user is in course : ${err} `);
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

exports.getUserById = async (user_id) => {
    try {
        const getUserByIdSQL = fs.readFileSync(path.resolve(__dirname, "../sql/getUserById.sql"), "utf8");
        return await database.query(getUserByIdSQL, [user_id]);
    } catch (err) {
        logger.error(`Error getting user: ${err} `);
        throw err;
    }
}

exports.getCourseForUser = async (user_id) => {
    try {
        const getCourseForUserSQL = fs.readFileSync(path.resolve(__dirname, "../sql/getCourseForUser.sql"), "utf8");
        return await database.query(getCourseForUserSQL, [user_id]);
    } catch (err) {
        logger.error(`Error getting user course: ${err} `);
        throw err;
    }
}

exports.getCourseAnswersForUsername = async (user_name) => {
    try {
        const getCourseAnswersForUsername = fs.readFileSync(path.resolve(__dirname, "../sql/getUserAnswersForCourseId.sql"), "utf8");
        return await database.query(getCourseAnswersForUsername, [user_name]);
    } catch (err) {
        logger.error(`Error getting course answers for user: ${err} `);
        throw err;
    }
}






