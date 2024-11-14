const courses = require('../../services/courses.js');
const assignments = require('../../services/assignments.js');
const answers = require('../../services/answers');

module.exports = (router) => {
    router.get('/courses/:student', async (req, res) => {
        const student = req.params.student;
        res.json(await courses.forStudent(student));
    });

    router.get('/studentCourses/:student', async (req, res) => {
        const student = req.params.student;
        res.json(await courses.studentCourses(student));
    });

    router.get('/courses/:course/assignments/:student', async (req, res) => {
        const { course, student } = req.params;
        res.json(await assignments.student(course, student));
    });

    router.post('/saveAnswer', answers.saveAnswer);

    router.get('/courses/:course/answers/:student', async (req, res) => {
        const { course, student } = req.params;
        res.json(await answers.student(student, course));
    });

    router.get('/answer/:assignment_id/:student', async (req, res) => {
        const { assignment_id } = req.params;
        res.json(await answers.getAnswersByAssignmentId(assignment_id));
    });

    router.get('/course/:id/:student', async (req, res) => {
        const { id, student } = req.params;
        res.json(await courses.course(student, id));
    });

    router.get('/course/assignment/feedback/:assignment_id', async (req, res) => {
        const { assignment_id } = req.params;
        res.json(await assignments.assignment(assignment_id));
    });

    router.get('/assignment/course/:assignment_id', async (req, res) => {
        const { assignment_id } = req.params;
        res.json(await assignments.getAssignmentCourse(assignment_id));
    });

    router.get('/course/assignment/answer/:assignment_id/:student/:course', async (req, res) => {
        const { assignment_id, student, course } = req.params;
        res.json(await answers.getAnswerAssignmentCourse(assignment_id, student, course));
    });

    //router.get('/course/assignment/answer/:student/:course', async (req, res) => {
    router.get('/assignments/course/:course', async (req, res) => {
        //const { student, course } = req.params;
        const { course } = req.params;
        //res.json(await answers.getCourseAssignmentAnswer(student, course));
        res.json(await answers.getCourseAssignments(course));
    });

    router.post('/deleteStudentAnswer', answers.deleteStudentAnswer);
};
