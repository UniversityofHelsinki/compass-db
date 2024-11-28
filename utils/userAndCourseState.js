const messageKeys = require('../utils/message-keys');
const { COURSE_ONGOING, COURSE_IN_FUTURE, COURSE_ENDED } = require('../Constants');
const dbApi = require('../api/dbApi');
const { logger } = require('../logger');
const courseInFuture = (user_in_course, course_date, res) => {
    if (user_in_course) {
        logger.info('User found in the course, COURSE_IN_FUTURE');
        res.json({
            course_state: COURSE_IN_FUTURE,
            message: messageKeys.USER_IS_IN_COURSE,
            course_date: course_date,
        });
    } else {
        logger.info('User not found in the course, COURSE_IN_FUTURE');
        res.json({
            course_state: COURSE_IN_FUTURE,
            message: messageKeys.USER_NOT_IN_COURSE,
            course_date: course_date,
        });
    }
};
const courseEnded = (user_in_course, course_date, res) => {
    if (user_in_course) {
        logger.info('User found in the course, COURSE_ENDED');
        res.json({
            course_state: COURSE_ENDED,
            message: messageKeys.USER_IS_IN_COURSE,
            course_date: course_date,
        });
    } else {
        logger.info('User not found in the course, COURSE_ENDED');
        res.json({
            course_state: COURSE_ENDED,
            message: messageKeys.USER_NOT_IN_COURSE,
            course_date: course_date,
        });
    }
};
const courseOngoing = (user_in_course, course_date, res) => {
    if (user_in_course) {
        logger.info('User found in the course, COURSE_ONGOING');
        res.json({
            course_state: COURSE_ONGOING,
            message: messageKeys.USER_IS_IN_COURSE,
            course_date: course_date,
        });
    } else {
        logger.info('User not found in the course, COURSE_ONGOING');
        res.json({
            course_state: COURSE_ONGOING,
            message: messageKeys.USER_NOT_IN_COURSE,
            course_date: course_date,
        });
    }
};
const courseState = [
    { evaluate: (course_state) => course_state === COURSE_IN_FUTURE, action: courseInFuture },
    { evaluate: (course_state) => course_state === COURSE_ENDED, action: courseEnded },
    { evaluate: (course_state) => course_state === COURSE_ONGOING, action: courseOngoing },
];

const processUserAndCourseState = async (course_state, user_id, course_id, course_date, res) => {
    let user_found_in_course = await dbApi.isuserincourse(user_id, course_id);
    const strategy = courseState.find((s) => s.evaluate(course_state));
    strategy.action(user_found_in_course, course_date, res);
};

const courseAndUserState = (course_state, user_id, course_id, course_date, res) => {
    processUserAndCourseState(course_state, user_id, course_id, course_date, res);
};
module.exports.courseAndUserState = courseAndUserState;
