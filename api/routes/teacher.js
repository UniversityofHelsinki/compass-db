const courses = require('../../services/courses.js');
const questions = require('../../services/questions.js');
const assignments = require('../../services/assignments.js');

module.exports = (router) => {

  router.post('/courses', async (req, res) => {
    const course = (await courses.save(req.body))[0];
    const courseAssignments = req.body.assignments.map(a => 
      ({ ...a, course_id: course.course_id })
    );
    if (courseAssignments) {
      const saved = courseAssignments.map(assignments.save);
      return res.json({ 
        ...course, 
        assignments: (await Promise.all(saved)).flat()
      });
    }
    return res.json(course);
  });

  router.put('/courses', async (req, res) => {
    const course = (await courses.update(req.body))[0];
    const courseAssignments = req.body.assignments;
    if (courseAssignments) {
      const updated = courseAssignments.map(assignment => {
        if (assignment.id) {
          return assignments.update(assignment);
        }
        return assignments.save({ 
          ...assignment, 
          course_id: course.course_id 
        });
      });

      return res.json({
        ...course,
        assignments: (await Promise.all(updated)).flat()
      });

    }
    res.json(course);
  });

  router.get('/courses/:teacher', async (req, res) => {
    const teacher = req.params.teacher;
    res.json(await courses.forTeacher(teacher));
  });

  router.get('/courses/:teacher/:course', async (req, res) => {
    const { teacher } = req.params;
    const course = await courses.singleCourse(teacher, req.params.course);
    const courseAssignments = await assignments.forCourse(course.course_id);
    if (courseAssignments) {
      return res.json({
        ...course,
        assignments: (await Promise.all(courseAssignments)).flat()
      });
    }
    return res.json(course);
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
};

