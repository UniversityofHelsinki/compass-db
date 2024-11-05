const database = require('./database');
const statisticsForCourse = async (courseId) => {
    if (!courseId) {
        return [];
    }

    const parsedCourseId = parseInt(courseId, 10);
    if (isNaN(parsedCourseId)) {
        throw new Error('Invalid course ID');
    }

    return await database.execute('teacher/pieChart.sql', [parsedCourseId]);
};

module.exports = { statisticsForCourse };
