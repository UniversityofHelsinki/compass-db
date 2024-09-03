import {logger} from "../logger.js";

const router = (router) => {
    router.get('/hello', (req, res) => {
        res.json({message: 'Hello, world!'});
    });
};

export default router;
