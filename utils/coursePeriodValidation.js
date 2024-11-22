const { COURSE_ONGOING, COURSE_OLD, COURSE_FUTURE } = require('../Constants');

const regExpYearMonthDay = /\T(.*)/;
const removeRestAfterT = (dateString) => dateString.replace(regExpYearMonthDay, '');

const validatePeriod = (course) => {
    let startDate = course.start_date;
    let endDate = course.end_date;
    const today = removeRestAfterT(new Date().toISOString());
    if (!startDate) {
        return 'assignment_start_date_is_empty';
    } else if (!endDate) {
        return 'assignment_end_date_is_empty';
    } else {
        let start_d = removeRestAfterT(startDate.toISOString());
        let end_d = removeRestAfterT(endDate.toISOString());
        if (start_d <= today && today <= end_d) {
            return COURSE_ONGOING;
        } else if (start_d < today && today > end_d) {
            return COURSE_OLD;
        } else {
            return COURSE_FUTURE;
        }
    }
};
module.exports = {
    validatePeriod,
};
