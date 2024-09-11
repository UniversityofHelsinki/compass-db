const {logger} = require("../logger");

const answers = require("../services/answers.js");

module.exports = (router) => {
    router.get('/hello', (req, res) => {
        logger.info('hello world');
        res.json({message: 'Hello, world!'});
    });
    router.post('/saveanswer', answers.insertanswer);
};
