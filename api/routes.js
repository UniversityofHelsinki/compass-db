import {logger} from "../logger.js";

const router = (router) => {
    router.get('/hello', (req, res) => {
        logger.info('hello from db');
        res.json({message: 'Hello, world!'});
    });
};

export default router;
