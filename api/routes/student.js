const courses = require('../../services/courses.js');
const assignments = require('../../services/assignments.js');
const answers = require('../../services/answers');
const { getAnswerAssignmentCourse } = require('../../services/answers');
const feedback = require('../../services/feedback');

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

    router.post('/saveFeedback', feedback.saveFeedback);

    router.get('/feedback/:course_id/:assignment_id/:student', async (req, res) => {
        const { course_id, assignment_id, student } = req.params;
        res.json(await feedback.feedbackForStudent(course_id, student, assignment_id));
    });

    router.get('/feedbackForCourse/:course_id', async (req, res) => {
        const { course_id } = req.params;
        res.json(await feedback.feedbackForCourse(course_id));
    });

    router.get('/courses/:course/answers/:student', async (req, res) => {
        const { course, student } = req.params;
        res.json(await answers.student(student, course));
    });

    router.get('/answer/:assignment_id/:student', async (req, res) => {
        const { assignment_id } = req.params;
        res.json(await answers.getAnswersByAssignmentId(assignment_id));
    });

    router.get('/course/:id/:student', async (req, res) => {
        const { id } = req.params;
        res.json(await courses.course(id));
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

    router.get('/assignments/course/:student/:course', async (req, res) => {
        const { student, course } = req.params;
        let result = (await answers.getCourseAssignments(course)) || [];

        let promises = result.map(async (elem) => {
            let found = await getAnswerAssignmentCourse(elem.id, student, course);
            if (found) {
                return { ...elem, answered: true };
            } else {
                return { ...elem, answered: false };
            }
        });

        Promise.all(promises).then((newResult) => {
            res.json(newResult);
        });
    });

    router.post('/deleteStudentAnswer', answers.deleteStudentAnswer);
};
