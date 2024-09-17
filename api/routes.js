const {logger} = require("../logger");

const answers = require("../services/answers.js");
const students = require("../services/students");

module.exports = (router) => {
    router.get('/hello', (req, res) => {
        logger.info('hello world');
        res.json({message: 'Hello, world!'});
    });
    router.post('/saveanswer', answers.insertanswer);
    router.get('/isstudentincourse', students.isstudentincourse);
    router.post('/addstudenttocourse', students.addstudenttocourse);
    router.post('/addstudent', students.addstudent);

};
