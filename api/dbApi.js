const fs = require ("fs");
const path = require ("path");
const {logger} = require("../logger");
const database = require("../services/database");

exports.insertanswer = async (answer) => {
    try {
        const insertAnswerSQL = fs.readFileSync(path.resolve(__dirname, "../sql/insertAnswer.sql"), "utf8");
        await database.query(insertAnswerSQL,
            [answer.userid, answer.courseid, new Date(), answer.topic_answer, answer.description_answer, parseInt(answer.multiple_choice_answer)]);
    } catch (err) {
        logger.error(`Error inserting answer : ${err} `);
        throw err;
    }
}

exports.adduser = async (user_id) => {
    try {
        const insertUserSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addUser.sql"), "utf8");
        return await database.query(insertUserSQL,[user_id, new Date()]);
    } catch (err) {
        logger.error(`Error inserting user : ${err} `);
        throw err;
    }
}

exports.adduserRole = async (user_id, role) => {
    try {
        const insertUserRolesSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addUserRole.sql"), "utf8");
        return await database.query(insertUserRolesSQL,[user_id, role]);
    } catch (err) {
        logger.error(`Error inserting role : ${err} `);
        throw err;
    }
}

exports.addcourse = async (data) => {
    try {
        let user_id = data.user_id;
        let course_id = data.course_id;
        let title = data.title;
        let description = data.description;
        let start_date = data.start_date;
        let end_date = data.end_date;
        const insertUserToCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/addCourse.sql"), "utf8");
        return await database.query(insertUserToCourseSQL,[user_id, course_id, title, description, start_date, end_date]);
    } catch (err) {
        logger.error(`Error adding course : ${err} `);
        throw err;
    }
}

exports.connectusertocourse = async (data) => {
    try {
        let user_id = data.user_id;
        let course_id = data.course_id;
        const insertUserToCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/connectUserToCourse.sql"), "utf8");
        return await database.query(insertUserToCourseSQL,[course_id, user_id]);
    } catch (err) {
        logger.error(`Error adding user to course : ${err} `);
        throw err;
    }
}

exports.isuserincourse = async (user_id, course_id) => {
    try {
        const isUserInCourseSQL = fs.readFileSync(path.resolve(__dirname, "../sql/isUserInCourse.sql"), "utf8");
        const result = await database.query(isUserInCourseSQL, [user_id, course_id]);
        return result?.user_name === user_id && result?.course_id === course_id;
    } catch (err) {
        logger.error(`Error checking if user is in course : ${err} `);
        throw err;
    }
}

exports.userExist = async (user_id) => {
    try {
        const userExistSQL = fs.readFileSync(path.resolve(__dirname, "../sql/userExist.sql"), "utf8");
        const result = await database.query(userExistSQL, [user_id]);
        return result?.user_name === user_id;
    } catch (err) {
        logger.error(`Error checking if user is in database : ${err} `);
        throw err;
    }
}
