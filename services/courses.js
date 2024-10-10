const { read } = require("../sql/read");
const database = require("../services/database.js");

exports.forTeacher = async (teacher) => {
  if (!teacher) {
    return [];
  }

  return await database.execute('teacher/courses.sql', [teacher]);
};

exports.forStudent = async (student) => {
  if (!student) {
    return [];
  }

  return await database.execute('student/courses.sql', [student]);
};

exports.students = async (course) => {
  if (!course) {
    throw new Error(
      `course ${course} must be defined.`
    );
  }

  return await database.execute('course/students.sql', [course]);
};

exports.studentCourse = async (course) => {
  if (!course) {
    throw new Error(
        `course ${course} must be defined.`
    );
  }
  return await database.execute('course/course.sql', [course]);
}
