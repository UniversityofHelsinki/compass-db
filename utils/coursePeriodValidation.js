const { COURSE_ONGOING, COURSE_ENDED, COURSE_IN_FUTURE } = require('../Constants');

const formatDate = (dateString) => {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); //Months are zero based
    let year = date.getFullYear();

    return `${day}.${month}.${year}`;
};
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
            return [COURSE_ONGOING];
        } else if (start_d < today && today > end_d) {
            return [COURSE_ENDED, formatDate(end_d)];
        } else {
            return [COURSE_IN_FUTURE, formatDate(start_d)];
        }
    }
};
module.exports = {
    validatePeriod,
};
