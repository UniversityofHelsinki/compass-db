const database = require('../services/database.js');

exports.forCourse = async (course) => {
  if (!course) {
    throw new Error(
      `course ${course} must be defined.`
    );
  }
  return await database.execute('course/assignments.sql', [course]);
};

exports.studentAssignments = async (course, student) => {
  if (!course || !student) {
    throw new Error(
      `course ${course} and student ${student} must be defined.`
    );
  }
  return await database.execute('course/studentAssignments.sql', [course, student]);
};

exports.singleAssignment = (req, res) => {
  const { course, assignment, student } = req.params;
  return res.json([]);
};


exports.assignment = async (assignment) => {
  if (!assignment) {
    throw new Error(
        `assignment ${assignment} must be defined.`
    );
  }
  return await database.execute('course/assignment.sql', [assignment]);
};

