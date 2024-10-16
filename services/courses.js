const { read } = require("../sql/read");
const database = require("../services/database.js");

const columns = (course) => {
  const keys = ['course_id', 'user_name', 'title', 'description', 'start_date', 'end_date'];
  const values = keys.map(key => course[key]);
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
    throw new Error(
      `course ${course} must be defined.`
    );
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

exports.students = async (course) => {
  if (!course) {
    throw new Error(
      `course ${course} must be defined.`
    );
  }

  return await database.execute('course/students.sql', [course]);
};
