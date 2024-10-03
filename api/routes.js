const {logger} = require("../logger");

const answers = require("../services/answers.js");
const students = require("../services/students");

module.exports = (router) => {
    router.get('/hello', (req, res) => {
        logger.info('hello world');
        res.json({message: 'Hello, world!'});
    });
    router.post('/saveanswer', answers.insertanswer);
    router.get('/isstudentincourse/:course_id/:student_id', students.isstudentincourse);
    router.post('/addstudenttocourse', students.addstudenttocourse);
    router.post('/addstudent', students.addstudent);
    router.get('/studentExist/:student_id', students.studentExist);
    router.get('/getUserAnswersForCourseId/:course_id/:user_name', answers.getUserAnswersForCourseId);
};
