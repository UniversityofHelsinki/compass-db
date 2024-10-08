const courses = require('../../services/courses.js');
const assignments = require('../../services/assignments.js');
const answers = require("../../services/answers");

module.exports = (router) => {

  router.get('/courses/:student', async (req, res) => {
    const student = req.params.student;
    res.json(await courses.forStudent(student));
  });

  router.get('/courses/:course/assignments/:student', async (req, res) => {
    const { course, student } = req.params;
    res.json(await assignments.studentAssignments(course, student))
  });

  router.post('/saveAnswer/:assignment_id/:student', answers.saveAnswer);

  router.get('/answer', async (req, res) => {
    const { assignment_id, student } = req.params;
    answers.getAnswer(assignment_id, student);
  });
};
