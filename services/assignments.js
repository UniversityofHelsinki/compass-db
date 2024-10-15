const database = require('../services/database.js');

const columns = (assignment) => {
  const keys = ['course_id', 'topic', 'start_date', 'end_date'];
  const values = keys.map(key => assignment[key]);
  if (assignment.id) {
    return [assignment.id, ...values];
  }
  console.log(values);
  return values;
};

exports.save = async (assignment) => {
  if (!assignment) {
    throw new Error(
      `assignment ${assignment} must be defined.`
    );
  }
  return await database.execute('assignment/save.sql', columns(assignment));
};

exports.update = async (assignment) => {
  if (!assignment) {
    throw new Error(
      `assignment ${assignment} must be defined.`
    );
  }
  return await database.execute('assignment/update.sql', columns(assignment));
};

exports.forCourse = async (course) => {
  if (!course) {
    throw new Error(
      `course ${course} must be defined.`
    );
  }
  return await database.execute('course/assignments.sql', [course]);
};

exports.student = async (course, student) => {
  if (!course || !student) {
    throw new Error(
      `course ${course} and student ${student} must be defined.`
    );
  }
  return await database.execute('course/studentAssignments.sql', [course, student]);
};

