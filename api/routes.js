const { logger } = require('../logger');

const users = require('../services/users');

module.exports = (router) => {
    router.get('/hello', (req, res) => {
        logger.info('hello world');
        res.json({ message: 'Hello, world!' });
    });
    router.get('/isuserincourse/:id/:user_id', users.isuserincourse);
    router.post('/addcourse', users.addcourse);
    router.post('/connectusertocourse', users.connectusertocourse);
    router.post('/addUser', users.addUser);
    router.get('/userExist/:user_id', users.userExist);
};
