const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');
const assert = require("assert");
const res = require("express/lib/response");

exports.addstudent = async (req, res) => {
    try {
        let user = req.body;
        let user_id = user.user_id;
        await dbApi.addstudent(user_id);
        logger.info(`Student added`)
        res.json([{message: messageKeys.STUDENT_ADDED}]);
    } catch (error) {
        logger.error(`error inserting student`);
        const msg = error.message;
        logger.error(`Error POST /addstudent ${error} ${msg}  USER ${req.body.user_id}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_STUDENT
        }]);
    }
}

exports.addstudenttocourse = async (req, res) => {
    try {
        let body = req.body;
        let user_id = body.user_id;
        let course_id = body.course_id;
        await dbApi.addstudenttocourse(user_id, course_id);
        logger.info(`Student added to course`)
        res.json([{message: messageKeys.STUDENT_ADDED_TO_COURSE}]);
    } catch (error) {
        logger.error(`error inserting student to course`);
        const msg = error.message;
        logger.error(`Error POST /addstudenttocourse ${error} ${msg}  USER ${req.body.user_id} COURSE ${req.body.course_id}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_STUDENT_TO_COURSE
        }]);
    }
}

exports.isstudentincourse = async (req, res) => {
    try {
        let user_id = req.params.student_id;
        let course_id = req.params.course_id;
        let student_found_in_course = await dbApi.isstudentincourse(user_id, course_id);
        if (student_found_in_course) {
            logger.info(`Student found in the course`)
            res.json([{message: messageKeys.STUDENT_IS_IN_COURSE}]);
        } else {
            logger.info(`Student not found in the course`)
            res.json([{message: messageKeys.STUDENT_NOT_IN_COURSE}]);
        }
    } catch (error) {
        logger.error(`error checking student in the course`);
        const msg = error.message;
        logger.error(`Error GET /isstudentincourse ${error} ${msg}  USER ${req.params.student_id}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_STUDENT_CHECKING_IN_COURSE
        }]);
    }

}

exports.studentExist = async (req, res) => {
    try {
        let user_id = req.params.student_id;
        let student_found_in_course = await dbApi.studentExist(user_id);
        if (student_found_in_course) {
            logger.info(`Student found`)
            res.json([{message: messageKeys.STUDENT_EXIST}]);
        } else {
            logger.info(`Student not found`)
            res.json([{message: messageKeys.STUDENT_NOT_EXIST}]);
        }
    } catch (error) {
        logger.error(`error checking student in the database`);
        const msg = error.message;
        logger.error(`Error GET /studentExist ${error} ${msg}  USER ${req.params.student_id}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_STUDENT_EXIST_IN_DATABASE
        }]);
    }

}