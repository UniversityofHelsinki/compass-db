import {logger} from "../logger.js";

const router = (router) => {
require('dotenv').config();

const answers = require("../services/answers.js");

module.exports = (router) => {
    router.get('/hello', (req, res) => {
        logger.info('hello world');
        res.json({message: 'Hello, world!'});
    });
    router.post('/saveanswer', answers.insertanswer);
};
