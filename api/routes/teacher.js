const courses = require('../../services/courses.js');
const questions = require('../../services/questions.js');
const assignments = require('../../services/assignments.js');
const answers = require('../../services/answers');
const { statisticsForCourse } = require('../../services/statistics');
const dbApi = require('../dbApi');
const { getAnswersAndFeedbacksByAssignmentId, getUserByUserId } = require('../dbApi');
const console = require('console');
const database = require('../../services/database');
const users = require('../../services/users');

module.exports = (router) => {
    router.post('/courses', async (req, res, next) => {
        try {
            const course = (await courses.save(req.body))[0];
            let data = {
                user_id: req.body.user_name,
                course_id: req.body.course_id,
                research_authorization: req.body.research_authorization,
            };
            await dbApi.connectusertocourse(data);

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
        } catch (error) {
            // Catch any errors and handle it, for example, send a response with the error.
            res.status(500).json({ error: 'Virhe kurssin luonnissa' });
        }
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
        //course['research_authorization'] = course['research_authorization'] ? '1' : '0';
        course['research_authorization'] =
            course['research_authorization'] === true
                ? '1'
                : course['research_authorization'] === null
                  ? null
                  : '0';

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
        const statistics = await statisticsForCourse(course);
        let resultCopy = [];
        let promises = statistics.map(async (row) => {
            let copy = null;
            const result = await getAnswersAndFeedbacksByAssignmentId(row.assignment_id);
            let answercopy = [];
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
        let resultCopy = [];
        await Promise.all(
            result.map(async (answer) => {
                const user = await dbApi.getUserByUserName(answer.user_name);
                if (user) {
                    const nameParts = user.display_name.split(' ');
                    let name =
                        nameParts.length > 1 ? nameParts.reverse().join(' ') : user.display_name;
                    copy = { ...answer, name: name };
                    resultCopy.push(copy);
                }
            }),
        );
        res.json(resultCopy);
    });

    router.get('/assignment/:assignmentId/answersAndFeedbacks', async (req, res) => {
        const assignmentId = req.params.assignmentId;
        const result = await getAnswersAndFeedbacksByAssignmentId(assignmentId);
        let resultCopy = [];
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

    router.get('/studentNameForId/:studentId', async (req, res) => {
        const studentId = req.params.studentId;
        console.log('studentId', studentId);
        res.json(await getUserByUserId(studentId));
    });

    router.delete('/deleteUserFromCourse', async (req, res) => {
        await courses.deleteUserFromCourse(req.body);
        res.status(200).end();
    });
};
