require('dotenv').config();

const answers = require("../services/answers.js");

module.exports = (router) => {
    router.get('/hello', (req, res) => {
        res.json({message: 'Hello, world!'});
    });
    router.post('/saveanswer', answers.insertanswer);
};
