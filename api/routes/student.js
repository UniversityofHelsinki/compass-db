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
    res.json(await assignments.studentAssignments(course, student));
  });

  router.post('/saveAnswer', answers.saveAnswer);

  router.get('/answer/:assignment_id/:student', async (req, res) => {
    const { assignment_id, student } = req.params;
    res.json(await answers.getAnswer(assignment_id));
  });

  router.get('/course/:course_id', async (req, res) => {
    const { course_id } = req.params;
    res.json(await courses.course(course_id));
  });

  router.get('/course/assignment/:assignment_id', async (req, res) => {
    const { assignment_id } = req.params;
    res.json(await assignments.assignment(assignment_id));
  });

};
