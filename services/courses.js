const { read } = require('../sql/read');
const database = require('../services/database.js');

const columns = (course) => {
    const keys = ['course_id', 'user_name', 'title', 'description', 'start_date', 'end_date'];
    const values = keys.map((key) => course[key]);
    if (course.id) {
        return [course.id, ...values];
    }
    return values;
};

exports.save = async (course) => {
    return await database.execute('course/save.sql', columns(course));
};

exports.update = async (course) => {
    return await database.execute('course/update.sql', columns(course));
};

exports.forTeacher = async (teacher) => {
    if (!teacher) {
        return [];
    }

    return await database.execute('teacher/courses.sql', [teacher]);
};

exports.singleCourse = async (teacher, course) => {
    if (!teacher || !course) {
        throw new Error(`course ${course} must be defined.`);
    }

    const courses = await database.execute('course/course.sql', [teacher, course]);
    return courses[0];
};

exports.forStudent = async (student) => {
    if (!student) {
        return [];
    }

    return await database.execute('student/courses.sql', [student]);
};

exports.studentCourses = async (student) => {
    if (!student) {
        return [];
    }

    return await database.execute('student/studentCourses.sql', [student]);
};

exports.students = async (course) => {
    if (!course) {
        throw new Error(`course ${course} must be defined.`);
    }

    return await database.execute('course/students.sql', [course]);
};

exports.course = async (student, id) => {
    if (!id) {
        throw new Error(
            `course ${id} must be defined.`
        );
    } if (!student) {
        throw new Error(
            `student ${student} must be defined.`
        );
    }

    const result = await database.execute('course/course.sql', [student, id]);
    if (result && result.length > 0) {
        return result[0];
    } else {
        return null;
    }
}

exports.byCourseId = async (course_id) => {
    if (!course_id) {
        return null;
    }

    return await database.execute('course/byCourseId.sql', [course_id]);
};
