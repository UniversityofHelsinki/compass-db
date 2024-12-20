const courses = require('../../services/courses.js');
const questions = require('../../services/questions.js');
const assignments = require('../../services/assignments.js');
const answers = require('../../services/answers');
const { statisticsForCourse } = require('../../services/statistics');
const dbApi = require('../dbApi');
const { getAnswersAndFeedbacksByAssignmentId } = require('../dbApi');
const console = require('console');

module.exports = (router) => {
    router.post('/courses', async (req, res) => {
        const course = (await courses.save(req.body))[0];
        if (req.body.assignments) {
            const courseAssignments = req.body.assignments.map((a) => ({
                ...a,
                course_id: course.course_id,
            }));
            if (courseAssignments) {
                const saved = courseAssignments.map(assignments.save);
                return res.json({
                    ...course,
                    assignments: (await Promise.all(saved)).flat(),
                });
            }
        }
        return res.json(course);
    });

    router.put('/courses', async (req, res) => {
        const course = (await courses.update(req.body))[0];
        const courseAssignments = req.body.assignments;
        if (courseAssignments) {
            const savedCourseAssignments = await assignments.forCourse(course.course_id);

            const removedAssignments = savedCourseAssignments.filter(
                (a) => !courseAssignments.map((ca) => ca.id).includes(a.id),
            );

            const isOnGoingAssignment = (assignment) => {
                const now = new Date();
                return assignment.start_date <= now && assignment.end_date >= now;
            };

            await Promise.all(
                removedAssignments
                    .filter((assignment) => !isOnGoingAssignment(assignment))
                    .map((a) => assignments.remove(a)),
            );

            const updated = courseAssignments.map((assignment) => {
                if (assignment.id) {
                    return assignments.update(assignment);
                }
                return assignments.save({
                    ...assignment,
                    course_id: course.course_id,
                });
            });

            return res.json({
                ...course,
                assignments: (await Promise.all(updated)).flat(),
            });
        }
        res.json({ ...course, assignments: [] });
    });

    router.delete('/courses', async (req, res) => {
        await courses.delete(req.body);
        res.status(200).end();
    });

    router.get('/courses/:teacher', async (req, res) => {
        const teacher = req.params.teacher;
        res.json(await courses.forTeacher(teacher));
    });

    router.get('/courses/course_id/:course_id', async (req, res) => {
        const courseId = req.params.course_id;
        const result = await courses.byCourseId(courseId);
        if (result && result.length === 0) {
            return res.json(null);
        }
        res.json(result[0]);
    });

    router.get('/courses/:teacher/:course', async (req, res) => {
        const { teacher } = req.params;
        const course = await courses.singleCourse(teacher, req.params.course);
        const courseAssignments = await assignments.forCourse(course.course_id);
        if (courseAssignments) {
            return res.json({
                ...course,
                assignments: (await Promise.all(courseAssignments)).flat(),
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

    router.get('/statistics/course/:course', async (req, res) => {
        const course = req.params.course;
        statistics = await statisticsForCourse(course);
        resultCopy = [];
        let promises = statistics.map(async (row) => {
            copy = null;
            const result = await getAnswersAndFeedbacksByAssignmentId(row.assignment_id);
            answercopy = [];
            await Promise.all(
                result.map(async (answer, index) => {
                    const user = await dbApi.getUserByUserName(answer.answer_user_name);
                    if (user) {
                        const nameParts = user.display_name.split(' ');
                        let name =
                            nameParts.length > 1
                                ? nameParts.reverse().join(' ')
                                : user.display_name;
                        answercopy.push({ ...answer, name: name });
                    }
                }),
            );
            if (answercopy.length > 0) {
                copy = { ...row, answers: answercopy };
                answercopy = [];
            } else {
                copy = { ...row };
            }
            resultCopy.push(copy);
        });

        Promise.all(promises).then((newResult) => {
            res.json(resultCopy);
        });
    });

    router.get('/assignment/:assignmentId/answers', async (req, res) => {
        const assignmentId = req.params.assignmentId;
        const result = await answers.getAnswersByAssignmentId(assignmentId);
        resultCopy = [];
        await Promise.all(
            result.map(async (answer) => {
                //console.log('id,user', answer.assignment_id, answer.user_name);
                const user = await dbApi.getUserByUserName(answer.user_name);
                if (user) {
                    const nameParts = user.display_name.split(' ');
                    let name =
                        nameParts.length > 1 ? nameParts.reverse().join(' ') : user.display_name;
                    copy = { ...answer, name: name };
                    //answer = copy;
                    resultCopy.push(copy);
                }
            }),
        );
        res.json(resultCopy);
    });

    router.get('/assignment/:assignmentId/answersAndFeedbacks', async (req, res) => {
        const assignmentId = req.params.assignmentId;
        const result = await getAnswersAndFeedbacksByAssignmentId(assignmentId);
        resultCopy = [];
        await Promise.all(
            result.map(async (row) => {
                //console.log('id,user', row.assignment_id, row.answer_user_name);
                const user = await dbApi.getUserByUserName(row.answer_user_name);
                if (user) {
                    const nameParts = user.display_name.split(' ');
                    let name =
                        nameParts.length > 1 ? nameParts.reverse().join(' ') : user.display_name;
                    copy = { ...row, name: name };
                    resultCopy.push(copy);
                }
            }),
        );
        res.json(resultCopy);
    });
};
