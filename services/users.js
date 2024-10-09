const dbApi = require ("../api/dbApi.js");
const {logger} = require("../logger");
const messageKeys = require('../utils/message-keys');
const assert = require("assert");
const res = require("express/lib/response");

exports.adduser = async (req, res) => {
    try {
        let user = req.body;
        let userName = user.eppn;
        let role = user.eduPersonAffiliation;
        let roles = role.split(';');

        let value = await dbApi.adduser(userName);

        roles.forEach(async (role) => {
            let result = await dbApi.adduserRole(value.id, role);
            //console.log("adduserRole", result);
        });

        logger.info(`User and roles added`)
        res.json({message: messageKeys.USER_ADDED});
    } catch (error) {
        logger.error(`error inserting user`);
        const msg = error.message;
        logger.error(`Error POST /adduser ${error} ${msg}  USER ${req.body.username}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER
        });
    }
}

exports.addcourse = async (req, res) => {
    try {
        let data = req.body;
        await dbApi.addcourse(data);
        logger.info(`Course added`)
        res.json({message: messageKeys.ADDED_COURSE});
    } catch (error) {
        logger.error(`error inserting user to course`);
        const msg = error.message;
        logger.error(`Error POST /addusertocourse ${error} ${msg}  USER ${req.body.user_id} COURSE ${req.body.course_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_COURSE
        });
    }
}

exports.connectusertocourse = async (req, res) => {
    try {
        let data = req.body;
        await dbApi.connectusertocourse(data);
        logger.info(`User added to course`)
        res.json({message: messageKeys.USER_ADDED_TO_COURSE});
    } catch (error) {
        logger.error(`error inserting user to course`);
        const msg = error.message;
        logger.error(`Error POST /addusertocourse ${error} ${msg}  USER ${req.body.user_id} COURSE ${req.body.course_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER_TO_COURSE
        });
    }
}

exports.isuserincourse = async (req, res) => {
    try {
        let course_id = req.params.course_id;
        let user_id = req.params.user_id;
        let user_found_in_course = await dbApi.isuserincourse(user_id, course_id);
        if (user_found_in_course) {
            logger.info(`User found in the course`)
            res.json({message: messageKeys.USER_IS_IN_COURSE});
        } else {
            logger.info(`User not found in the course`)
            res.json({message: messageKeys.USER_NOT_IN_COURSE});
        }
    } catch (error) {
        logger.error(`error checking user in the course`);
        const msg = error.message;
        logger.error(`Error GET /isuserincourse ${error} ${msg}  USER ${req.params.user_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_USER_CHECKING_IN_COURSE
        });
    }

}

exports.userExist = async (req, res) => {
    try {
        let user_id = req.params.user_id;
        let user_found_in_course = await dbApi.userExist(user_id);
        if (user_found_in_course) {
            logger.info(`User found`)
            res.json({message: messageKeys.USER_EXIST});
        } else {
            logger.info(`User not found`)
            res.json({message: messageKeys.USER_NOT_EXIST});
        }
    } catch (error) {
        logger.error(`error checking user in the database`);
        const msg = error.message;
        logger.error(`Error GET /userExist ${error} ${msg}  USER ${req.params.user_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_USER_EXIST_IN_DATABASE
        });
    }
}
