const courses = require('../../services/courses.js');
const questions = require('../../services/questions.js');
const assignments = require('../../services/assignments.js');

module.exports = (router) => {

  router.get('/courses/:teacher', async (req, res) => {
    const teacher = req.params.teacher;
    res.json(await courses.forTeacher(teacher));
  });

  router.get('/courses/:course/questions', async (req, res) => {
    const course = req.params.course;
    res.json(await questions.forCourse(course));
  });

  router.get('/courses/:course/assignments', async (req, res) => {
    const course = req.params.course;
    res.json(await assignments.forCourse(course));
  });

  router.get('/courses/:course/students', async (req, res) => {
    const course = req.params.course;
    res.json(await courses.students(course));
  });

  router.get('/courses/:teacher', async (req, res) => {
    const { teacher } = req.params;
    res.json(await courses.forTeacher(teacher));
  });

};

