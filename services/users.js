const courses = require('./courses');
const { COURSE_ONGOING } = require('../Constants');

const dbApi = require('../api/dbApi.js');
const { logger } = require('../logger');
const messageKeys = require('../utils/message-keys');
const { validatePeriod } = require('../utils/coursePeriodValidation');
const { courseAndUserState } = require('../utils/userAndCourseState');

const synchronizeUserRoles = async (userId, roles) => {
    const foundRoles = await dbApi.getUserRoles(userId);

    // Extract role names from foundRoles objects
    const foundRoleNames = foundRoles.map((roleObj) => roleObj.role);

    // Add missing roles
    const rolesToAdd = roles.filter((role) => !foundRoleNames.includes(role));
    for (const role of rolesToAdd) {
        await dbApi.adduserRole(userId, role);
    }

    // Remove extra roles
    const rolesToRemove = foundRoleNames.filter((foundRole) => !roles.includes(foundRole));
    for (const foundRole of rolesToRemove) {
        await dbApi.removeUserRole(userId, foundRole);
    }
};

const addUser = async (req, res) => {
    try {
        const user = req.body;
        const userName = user.eppn;
        const roles = user.eduPersonAffiliation;
        const displayName = user.displayName;

        const userExists = await dbApi.userExist(userName);
        let userId;

        if (!userExists) {
            userId = await dbApi.addUser(userName, displayName);
        } else {
            userId = await dbApi.getUserId(userName);
        }
        await synchronizeUserRoles(userId, roles);
        res.json({ message: messageKeys.USER_ADDED });
    } catch (error) {
        logger.error(`Error inserting user: ${error}`);
        const msg = error.message;
        logger.error(`Error POST /adduser: ${msg} USER: ${req.body.username}`);
        res.status(500).json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER,
        });
    }
};

// Other exports
const addcourse = async (req, res) => {
    try {
        let data = req.body;
        await dbApi.addcourse(data);
        logger.info(`Course added`);
        res.json({ message: messageKeys.ADDED_COURSE });
    } catch (error) {
        logger.error(`error inserting user to course`);
        const msg = error.message;
        logger.error(
            `Error POST /addusertocourse ${error} ${msg}  USER ${req.body.user_id} COURSE ${req.body.course_id}`,
        );
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_COURSE,
        });
    }
};

const connectusertocourse = async (req, res) => {
    try {
        let data = req.body;
        await dbApi.connectusertocourse(data);
        logger.info(`User added to course`);
        res.json({ message: messageKeys.USER_ADDED_TO_COURSE });
    } catch (error) {
        logger.error(`error inserting user to course`);
        const msg = error.message;
        logger.error(
            `Error POST /addusertocourse ${error} ${msg}  USER ${req.body.user_id} COURSE ${req.body.course_id}`,
        );
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER_TO_COURSE,
        });
    }
};

const isuserincourse = async (req, res) => {
    try {
        let id = req.params.id;
        let user_id = req.params.user_id;
        const { course_id } = req.query;

        let course = await courses.course(id);
        const [course_state, course_date] = validatePeriod(course);
        courseAndUserState(course_state, user_id, course_id, course_date, res);
    } catch (error) {
        logger.error(`error checking user in the course`);
        const msg = error.message;
        logger.error(`Error GET /isuserincourse ${error} ${msg}  USER ${req.params.user_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_USER_CHECKING_IN_COURSE,
        });
    }
};

const userExist = async (req, res) => {
    try {
        let user_id = req.params.user_id;
        let user_found_in_course = await dbApi.userExist(user_id);
        if (user_found_in_course) {
            logger.info(`User found`);
            res.json({ message: messageKeys.USER_EXIST });
        } else {
            logger.info(`User not found`);
            res.json({ message: messageKeys.USER_NOT_EXIST });
        }
    } catch (error) {
        logger.error(`error checking user in the database`);
        const msg = error.message;
        logger.error(`Error GET /userExist ${error} ${msg}  USER ${req.params.user_id}`);
        res.status(500);
        return res.json({
            message: messageKeys.ERROR_MESSAGE_USER_EXIST_IN_DATABASE,
        });
    }
};

module.exports = {
    synchronizeUserRoles,
    addUser,
    addcourse,
    connectusertocourse,
    isuserincourse,
    userExist,
};
